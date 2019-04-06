// Callback format for iteration.
type MatchCbk = (match: RegExpExecArray) => any

/**
 * Issue a callback for each match of a global-flagged
 * regular expression.
 */
export function regexEach(regex: RegExp, str: string, onMatch: MatchCbk) {
  // The global flag must be set to avoid an infinite while loop.
  if (!regex.global) {
    throw new Error(
      'Regular expressions used with RegExp "each" must have the global flag set')
  }

  // Store the match for each iteration
  let match: RegExpExecArray|null

  // Loop over each match of a regular expression against a string.
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regex.exec(str)) !== null) {
    const data = onMatch(match)
    // Terminate if returned value is not null|undefined.
    if (data != null) { return data }
  }
}
