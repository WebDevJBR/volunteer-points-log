import * as crypto from 'crypto';

export default class CryptoHelper {
  /**
   * Produces a SHA256 hash using the given password and salt.
   * @param password The password to hash.
   * @param salt The salt to use with the password,
   */
  static hashPassword(password: string, salt: string) {
    const hash = crypto.createHash('sha256');

    hash.update(password);
    hash.update(salt);

    return hash.digest('hex');
  }

  /**
   * Generates a 16 byte salt to be used when hashing a password.
   */
  static generateSalt() {
    return crypto.randomBytes(16).toString("hex");
  }
}