import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt with a specified number of salt rounds.
 * @param password {string} Plain-text password to be hashed.
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Defines the cost factor for bcrypt
  return await bcrypt.hash(password, saltRounds); // Automatically generates a salt
};

/**
 * Verify a password against a hashed value.
 * @param password {string} The plain-text password.
 * @param hashedPassword {string} The stored hashed password.
 * @returns {Promise<boolean>} True if the password matches the hash, false otherwise.
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword); // Compares plain password with hash
};
