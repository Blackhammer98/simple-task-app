import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client';
import userRoutes from './Routes/userRoutes.js';
import taskRoutes from './Routes/taskRoutes.js';
import "dotenv/config";



const prisma = new PrismaClient();
const app = new Hono()


app.route("/api/v1" , userRoutes(prisma));
app.route("/api/v1" , taskRoutes(prisma));

app.get("/" ,(c) => {
  return c.text("hello hono")
})
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
