import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import userRoutes from './Routes/userRoutes.js';
import taskRoutes from './Routes/taskRoutes.js';
import "dotenv/config";



const prisma = new PrismaClient();
const app = new Hono()

app.use("/*" ,cors({
  
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
    credentials: true,
  
}));
app.route("/api/v1/user" , userRoutes(prisma));
app.route("/api/v1/task" , taskRoutes(prisma));

app.get("/" ,(c) => {
  return c.text("hello hono")
})
serve({
  fetch: app.fetch,
  port: 8080
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
