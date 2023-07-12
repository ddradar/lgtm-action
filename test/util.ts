/** Generate [0-9a-z]{length} string. */
export function generateRandomString(length: number): string {
  return [...(Array(length) as unknown[])]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join('')
}
