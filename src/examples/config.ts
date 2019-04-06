import regexEach from '..'

const configuration =
`
read=true
float
fly

[options]
size=5
root=./data
haltOnError=false

[fruits]
apples
cherries
raspberries
`

interface IContext {
  name: string
  keyVals: any
  values: string[]
}

// Define tokens used by the parser.
const tContext = String.raw`\[(.+?)\]`
const tKeyVal = String.raw`(.+?=.+)`
const tVal = String.raw`(\S+)`

// Create the parser.
const tParser = String.raw`${tContext}|${tKeyVal}|${tVal}`
const parser = new RegExp(tParser, 'g')

/**
 * Create and return a context object.
 */
function createContext(name: string): IContext {
  return { name, keyVals: {}, values: [] }
}

/**
 * Parse a configuration file.
 */
function parse(cfg: string) {
  // Create the initial, global-scope context.
  let context = createContext('$global')

  // Store all contexts created during parsing.
  const contextList = [context]

  // Run the parser on the configuration.
  regexEach(parser, cfg, (match) => {
    const [, ctx, keyval, val] = match

    // If a context name is encountered, create a new one.
    if (ctx != null) {
      context = createContext(ctx.trim())
      contextList.push(context)
    }

    // If a key/value pair is encountered, add to context keyVals.
    if (keyval != null) {
      const [key, value] = keyval.split('=')
      context.keyVals[key.trim()] = value.trim()
    }

    // If a regular value is encountered, add to context values.
    if (val != null) {
      context.values.push(val.trim())
    }
  })

  return contextList
}

const items = parse(configuration)
items.forEach(x => console.log(x))
