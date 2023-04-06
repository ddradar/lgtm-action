/** Generate [0-9a-z]{length} string. */
export function generateRandomString(length: number): string {
  return [...Array(Number.isInteger(length) ? length : 12)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join('')
}
