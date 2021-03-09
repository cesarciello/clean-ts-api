export class EmailInUseError extends Error {
  constructor() {
    super('The received emial alreay in use')
    this.name = 'EmailInUseError'
  }
}
