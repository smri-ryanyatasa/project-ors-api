import sql from 'mssql';
import { env } from './env';
import { logger } from './logger';

const config: sql.config = {
  server: env.DB_SERVER!,
  port: Number(env.DB_PORT),
  database: env.DB_DATABASE!,
  user: env.DB_USER!,
  password: env.DB_PASSWORD!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
let pool: sql.ConnectionPool | null = null;

export async function getDb() {
  try {
    if (pool?.connected) {
      return pool;
    }

    pool = await new sql.ConnectionPool(config).connect();

    logger.info('✅ Connected to SQL Server');

    return pool;
  } catch (error) {
    logger.error('❌ Failed to connect to SQL Server');
    console.error(error);
    throw error;
  }
}