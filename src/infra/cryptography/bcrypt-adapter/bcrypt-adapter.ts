/* eslint-disable no-return-await */
import bcrypt from 'bcrypt';
import { Encrypter } from '../../../data/protocols/criptography/envrypter';
import { HashComparer } from '../../../data/protocols/criptography/hash-compare';

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
