// Callback format for iteration.
export type MatchCbk = (match: RegExpExecArray, expr: RegExp) => void

/**
 * Issue a callback for each match of a global-flagged
 * regular expression.
 */
export default function regexEach(expr: RegExp|string, str: string, onMatch: MatchCbk) {
  let regex: RegExp

  // Define regex based on the type of expr.
  if (typeof expr === 'string') {
    regex = new RegExp(expr, 'g')
  } else {
    // Force global if expr doesn't already have it.
    const isGlobal = expr.sticky || expr.global
    regex = new RegExp(expr.source, isGlobal ? expr.flags : expr.flags + 'g')
  }

  // Store the match for each iteration
  let match: RegExpExecArray|null

  // Loop over each match of a regular expression against a string.
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regex.exec(str)) !== null) {
    onMatch(match, regex)
  }
}
