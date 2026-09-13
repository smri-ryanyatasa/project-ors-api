import sql from 'mssql';
import { env } from './env';
import { logger } from './logger';

const config: sql.config = {
  server: env.DB_SERVER!,
  port: Number(env.DB_PORT),
  database: env.DB_DATABASE!,
  user: env.DB_USER!,
  password: env.DB_PASSWORD!,

  pool: {
    max: 20, // test - starting point for pool setup in prod can be increased depends in the testing
    min: 2, // minimum db connection then automatic increase if receives bulk
    idleTimeoutMillis: 30000, // idle before timeout
  },

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  requestTimeout: 120000,
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