import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),

  DB_SERVER: process.env.DB_SERVER!,
  DB_PORT: Number(process.env.DB_PORT!),
  DB_DATABASE: process.env.DB_DATABASE!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,

  JWT_SECRET: process.env.JWT_SECRET!,
};