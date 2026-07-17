import { Hono } from 'hono';
import { cors } from 'hono/cors';

import routes from './routes';

const app = new Hono();

app.use(
    '*',
    cors({
        origin: 'http://localhost:3033',
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
);

app.route('/api', routes);

export default app;