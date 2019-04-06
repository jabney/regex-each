/**
 * Parse command-line arguments
 */
import regexEach from '../index'

const tChar = String.raw`[a-z-]`
const tArg = String.raw`--${tChar}+|-${tChar}+`
const tVal = String.raw`\S+`

const tParser = String.raw`\s+|(${tArg})|(${tVal})`
const parser = new RegExp(tParser, 'yi')

interface IArgument {
  name: string
  values: string[]
}

function parse(str: string) {
  let context: IArgument = { name: '$default', values: [] }
  const args: IArgument[] = [context]

  regexEach(parser, str, (match) => {
    const [_, arg, value] = match

    // Handle arguments, e.g., --something or -s.
    if (arg != null) {
      const name = arg.replace(/-+/, '')
      context = { name, values: [] }
      args.push(context)
    }

    // Handle values.
    if (value != null) {
      context.values.push(value)
    }
  })

  return args
}

const args = parse('each --nums 1 2 3 --alpha abc def g')
console.log(args)
