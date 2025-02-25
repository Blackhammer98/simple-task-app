import { signinInput, signupInput } from "@nikit086/task-common";
import bcrypt from 'bcrypt';
import { error } from "console";
import { Hono } from "hono";
import { sign } from "hono/jwt";
export default function userRoutes(prisma) {
    const router = new Hono();
    router.post("/signup", async (c) => {
        const body = await c.req.json();
        const { success } = signupInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are incorrect"
            });
        }
        const { username, email, password } = body;
        if (!username || !email || !password) {
            return c.json({
                error: "Missing required fields"
            }, 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: {
                    username: body.username,
                    email: body.email,
                    password: hashedPassword
                },
            });
            return c.json({
                message: "User Created Successfuly",
                user: {
                    id: user.id,
                    username,
                    email,
                },
            }, 201);
        }
        catch (error) {
            return c.json({
                error: "Uername or email already exist"
            }, 409);
        }
    });
    router.post("/signin", async (c) => {
        const body = await c.req.json();
        const { success } = signinInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json({
                message: "Inputs are incorrect"
            });
        }
        const { email, password } = body;
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            }
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return c.json({
                error: "Invalid credentials"
            }, 401);
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables");
            return c.json({
                message: "Server configuration error",
                success: false,
            }, 500);
        }
        const token = await sign({ id: user.id }, jwtSecret);
        return c.json({
            message: "Signin Successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email,
            },
        }, 200);
    });
    return router;
}
