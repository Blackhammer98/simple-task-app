import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import userRoutes from './Routes/userRoutes.js';
const prisma = new PrismaClient();
const app = new Hono();
app.route("/api/vi", userRoutes(prisma));
app.get("/", (c) => {
    return c.text("hello hono");
});
serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
