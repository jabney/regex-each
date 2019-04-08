# regex-each
Iterate matches in a string using a JavaScript regular expression

Written in typescript targeting ES2015 JavaScript.

## Installation
```
npm install regex-each
```

### Example

```typescript
import regexEach from 'regex-each'

const words: string[] = []
const nums: number[] = []

// Parse words and numbers.
regexEach(/([a-z]+)|([0-9]+)/i, '10 apples for 5 dollars', (match) => {
  const [, word, num] = match

  if (word != null) {
    words.push(word)
  }

  if (num != null) {
    nums.push(parseInt(num, 10))
  }
})

console.log('nums:', nums)
console.log('words:', words)
```

Output:

```
nums: [ 10, 5 ]
words: [ 'apples', 'for', 'dollars' ]
```

## Signature

```typescript
regexEach(
  expr: RegExp|string,
  str: string,
  onMatch: (match: RegExpExecArray, regex: RegExp) => void
) => void
```

`expr`: a regular expression or a string.
- If `expr` is a regular expression, it remains unmodified -- an internal copy is made by `regex-each`. If no `sticky` or `global` flag is set on `expr`, the `global` flag is added automatically.
- If `expr` is a string, it is converted to a regular expression and the `global` flag is added automatically. There is no way to add other flags when a string is used. If you need flags, create and pass a `RegExp` object.

`str`: the string to iterate matches on.

`onMatch`: called for each match. The `match` parameter is the regular expression `exec` result, and the `regex` parameter is the regular expression used for matching.

## RegExp.prototype.each

While monkey-patching globals isn't recommended, it's possible to add `regex-each` functionality to the `RegExp` prototype:

```typescript
import regexEach, { MatchCbk } from 'regex-each'

declare global {
  interface RegExp {
    each(str: string, onMatch: MatchCbk): void
  }
}

RegExp.prototype.each = function (str: string, onMatch: MatchCbk) {
  return regexEach(this, str, onMatch)
}

const re = /([a-z]+)|([0-9]+)/i

re.each('10 apples for 5 dollars', (match) => {
  const [, word, num] = match
  console.log(word, num)
})
```

Output:

```javascript
undefined '10'
apples undefined
for undefined
undefined '5'
dollars undefined
```

## More Examples

### Parse command-line arguments

```typescript
import regexEach from 'regex-each'

// Define tokens used by the parser.
const tChar = String.raw`[a-z-]`
const tArg = String.raw`--${tChar}+|-${tChar}+`
const tVal = String.raw`\S+`

// Create the parser.
const tParser = String.raw`\s+|(${tArg})|(${tVal})`
const parser = new RegExp(tParser, 'yi')

interface IArgument {
  name: string
  values: string[]
}

/**
 * Parse an argument string.
 */
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
```

Output:

```javascript
[
  { name: '$default', values: [ 'each' ] },
  { name: 'nums', values: [ '1', '2', '3' ] },
  { name: 'alpha', values: [ 'abc', 'def', 'g' ] }
]
```

### Parse configuration files

```typescript
import regexEach from 'regex-each'

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
  keyVals: {[key: string]: any}
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
console.log(items)
```

Output:

```javascript
[
  {
    name: '$global',
    keyVals: { read: 'true' },
    values: [ 'float', 'fly' ]
  },
  {
    name: 'options',
    keyVals: { size: '5', root: './data', haltOnError: 'false' },
    values: []
  },
  {
    name: 'fruits',
    keyVals: {},
    values: [ 'apples', 'cherries', 'raspberries' ]
  }
]
```