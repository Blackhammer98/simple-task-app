import type { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { Hono } from "hono";
import { use } from "hono/jsx";
import { sign } from "hono/jwt";

const My_secret = process.env.JWT_SECRET || "my secret_key";

export default function userRoutes(prisma : PrismaClient) {
    const router  = new Hono();


    router.post("/signup" , async (c) => {
        const body = await c.req.json();
        const {username , email , password} = body;


        if(!username || !email || !password){
            return c.json({
                error : "Missing required fields"
            }, 400);
        }

        const hashedPassword = await bcrypt.hash(password,10);

        try {

            const user = await prisma.user.create({
                data : {
                    username,
                    email,
                    password: hashedPassword,
                },
            });

            return c.json({
                message: "User Created Successfuly",
                user : {
                    id : user.id,
                    username,
                    email,
                },
            },201);
            
        } catch (error) {
            return c.json({
                error : "Uername or email already exist"
            },409);
        }
    });

    router.post("/signin" , async (c) => {
      const body = await c.req.json();
      const {email , password} = body;

      const user = await prisma.user.findUnique({
        where : {
            email ,
        }
      });

      if(!user || !(await bcrypt.compare(password , user.password))){
        return c.json({
            error : "Invalid credentials"
        },401)
      }

      const token = await sign({id : user.id},My_secret);
       return c.json({
        message : "Signin Successful",
        token,
        user : {
            id : user.id,
            username:user.username,
            email,
        },
       },200);

    });
//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.UQvbR8lR0_4oEpAY6yAgrBNrhqelgaKZxDKSDtx3_7k",

    return router;
}