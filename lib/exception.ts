export class SerializerError extends Error {
  constructor(
    private error: Error,
    private metadata: Record<'value' | 'details', string>,
  ) {
    super()
    this.name = 'SerializerError'
    this.message = metadata.details

    Object.defineProperty(this, 'stack', {
      value: Object.assign(this.constructor.prototype, {
        stack: this.stack,
        details: error.message,
        error: this.getError(),
        metadata: metadata.value,
      }),
    })
  }

  public get getErrorPosition(): number {
    return +this.error.message.split('in JSON at position ')[1]
  }

  public getError(): string {
    return `> ${this.metadata.value
      .split('')
      .splice(this.getErrorPosition)
      .join('')}`
  }
}
