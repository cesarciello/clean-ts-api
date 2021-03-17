export interface HashComparer {
  compare: (valeu: string, hash: string) => Promise<boolean>
}
