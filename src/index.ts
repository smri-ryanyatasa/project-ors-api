import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';

logger.info('✅ Server started');

export default {
  port: env.PORT,
  idleTimeout: 60,
  fetch: app.fetch,
};