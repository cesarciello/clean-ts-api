export class EmailInUseError extends Error {
  constructor() {
    super('The received email alreay in use')
    this.name = 'EmailInUseError'
  }
}
