/**
 * Extract words and numbers
 */
import { regexEach } from '..'

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
