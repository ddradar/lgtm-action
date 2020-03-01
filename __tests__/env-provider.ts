export default class EnvProvider {
  private readonly storedEnv: NodeJS.ProcessEnv
  private readonly unstoredKeys: string[]
  /** Create EnvProvider instance.
   * @param keys object keys you do not want to stored
   */
  constructor(...keys: string[]) {
    this.unstoredKeys = keys
    this.storedEnv = { ...process.env }
  }

  /** Load storedEnv to process.env except unstoredKeys. */
  load(): void {
    process.env = { ...this.storedEnv }
    this.unstoredKeys.forEach((key) => delete process.env[key])
  }

  /** Reset process.env from storedEnv. */
  reset(): void {
    process.env = { ...this.storedEnv }
  }
}
