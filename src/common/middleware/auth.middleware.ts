import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authMiddleware(
  c: Context,
  next: Next
) {
  const authorization = c.req.header('Authorization');

  if (!authorization) {
    return c.json(
      {
        status: 'error',
        message: 'Authorization token is required.',
        data: null,
      },
      401
    );
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    c.set('user', decoded);

    await next();
  } catch {
    return c.json(
      {
        status: 'error',
        message: 'Invalid or expired token.',
        data: null,
      },
      401
    );
  }
}