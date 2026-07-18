import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(user: any): string {
    return jwt.sign(
        {
            user_id: user.user_id,
            user_name: user.user_name,
            },
        JWT_SECRET,
        {
            expiresIn: '7h',
        }
    );
}