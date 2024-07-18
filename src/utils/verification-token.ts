import * as jwt from 'jsonwebtoken';

export function generateVerificationToken(email: string): string {
  const secret = 'your-secret-key'; // Use a more secure secret in a real app
  const payload = { email };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
}
