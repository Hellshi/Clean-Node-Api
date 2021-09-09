/* eslint-disable no-unused-vars */
export interface HashComparer {
  compare(value: string, hash: string): Promise<boolean>
}
