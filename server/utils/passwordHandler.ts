import bcrypt from "bcrypt";

class Hasher {
  private saltRound: number;

  constructor(saltRound: number) {
    this.saltRound = saltRound;
  }

  createPassword(rawPassword: string): string {
    const salt = bcrypt.genSaltSync(this.saltRound);
    return bcrypt.hashSync(rawPassword, salt);
  }

  checkPassword(rawPassword: string, hashPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, hashPassword);
  }
}

export const useHash = new Hasher(12);
