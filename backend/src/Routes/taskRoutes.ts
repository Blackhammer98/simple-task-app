import type {PrismaClient } from "@prisma/client";
import { Hono} from "hono";

import { verify } from "hono/jwt";


interface AppVariables {
    userId: number; 
  }



export default function taskRoutes(prisma : PrismaClient) {

    const router = new Hono<{

         Variables: AppVariables 

        }>();


 router.use("/*",async (c, next) =>{
  const authHeader = c.req.header("authorization") || "";
  const jwt_Secret = process.env.JWT_SECRET ;


  if (!jwt_Secret) {
    console.error("JWT_SECRET is not defined in environment variables");
    return c.json({message:"Error"});
  }
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: Missing or invalid Bearer token", success: false }, 401);
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ message: "Unauthorized: No token provided", success: false }, 401);
  }
  try {

    const payload = (await verify(token, jwt_Secret)) as { id: string };
    const userId = parseInt(payload.id);


    if (isNaN(userId)) {
      return c.json({ message: "Invalid token: User ID must be a number", success: false }, 401);
    }

    
    c.set("userId", userId);
    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return c.json({ message: "Invalid or expired token", success: false }, 401);
  }

 });

    router.post("/addtask",  async (c) => {
try {
    const userId = c.get("userId");
      if (!userId) {
        return c.json({ message: "Unauthorized", success: false }, 401);
      }
    const body = await c.req.json();
    const { title ,description  } = body;

    if(!title || !userId) {
        return c.json({
            message : "Title and userId are required to create a task",
            success : false,
        },400);
    };

  
  const task = await prisma.task.create({
      data: {
        title,
        description : description || "",
        userId : userId
      },
  });

  return c.json({
   message : "Task created successfully",
   success : true,
   data : task,
  },201);
    
} catch (error) {
    console.error("Error creating a task" , error);
    return c.json({
        message :"Failed to create task",
        success : false,
    },500);
}
 });


router.get("/gettask/:id" , async (c) => {
try {

    const userId = c.get("userId");

    if (!userId) {
        return c.json({ message: "Unauthorized", success: false }, 401);
      }

    const idString = c.req.param("id");
   const id = parseInt(idString);

    const task  = await prisma.task.findUnique({
        where : {
            id 
        },
    });
    if(!task) {
        return c.json({
            message : `No task found with id "${id}"`,
            success : false,

        },400)
    }

     return c.json({
        message : "Task retrived successfully",
        success : true,
        data : task,
     },200);

} catch (error) {
   console.error("error while retrieving task" , error);
   return c.json({
    message : "Failed to retrieve task",
    success : false,
    
   },500);
}
});

router.put("/updatetask/:id" , async (c) => {
    
    try {
        const userId = c.get("userId");
        const idString = c.req.param('id');
        const id = parseInt(idString);

        const body = await c.req.json();
        const task = await prisma.task.findUnique({ where: { id } });
            if (!task) {
                return c.json({ message: `No task found with ID "${id}"`, success: false }, 404);
                }
                if (task.userId !== userId) {
                    return c.json({ message: "Permission denied", success: false }, 403);
                }    
        await prisma.task.update({
           where :{id},
           data :{
            title : body.title,
            description : body.description
           }
        });

        return c.json({
            message : "Task update successfully",
            data : body,
        },200);
        
    } catch (error) {
        console.error("error while updating task" ,error)
        return c.json({
            message : "Failed to update task",
            error : "internal server error"
        },500);
    }
});

router.get("/getalltasks",async (c) => {
    try{
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ message: "Unauthorized", success: false }, 401);
          }
        
    const tasks = await prisma.task.findMany({
        where : {userId}
    })
    return c.json({
        message : "Tasks retrieved successfully",
        data : tasks,
    },200);

} catch(error){
   console.error("Error while retrieving all tasks");
   return c.json({
    message : "Failled to retrieve all tasks"
   },500);
}
});
    return router;

}