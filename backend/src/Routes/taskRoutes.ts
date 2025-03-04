import { createTaskInput, updateTaskInput } from "@nikit086/task-common";
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

//create task route
 router.post("/addtask",  async (c) => {
     try {
      const body = await c.req.json();
      const {success} = createTaskInput.safeParse(body);
      if(!success) {
        c.status(411);
        return c.json({
          message:"Inputs are incorrect"
        });
      }

    const userId = c.get("userId");
      if (!userId) {
        return c.json({ message: "Unauthorized", success: false }, 401);
      }
    
    const { title ,description  } = body;

    if(!title || !userId) {
        return c.json({
            message : "Title and userId are required to create a task",
            success : false,
        },400);
    };

  
  const task = await prisma.task.create({
      data: {
       title : body.title,
      description : body.description || "",
        userId : (userId)
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


router.patch("/taskstatus/:id/status" , async (c) => {
try {

    const userId = c.get("userId");

    if (!userId) {
        return c.json({ message: "Unauthorized", success: false }, 401);
      }

    const idString = c.req.param("id");
   const id = parseInt(idString);

   const body = await c.req.json();
   const {status} = body;

   if(!status || !["Pending", "In Progress", "Completed"].includes(status)) {
    return c.json({ message: "Invalid status value", success: false }, 400);
   }


    const task  = await prisma.task.findUnique({
        where : {
            id ,
            userId,
        },
    });
    if(!task) {
        return c.json({
            message : `No task found with id "${id}"`,
            success : false,

        },404)
    }

    const updatedTask = await prisma.task.update({
      where :  {
        id ,
        userId,
      },
      data : {
        status
      }
    });

     return c.json({
        message : "Task status updated successfully",
        success : true,
        data : updatedTask,
     },200);

} catch (error) {
   console.error("Error updating task status:" , error);
   return c.json({
    message : "Failed to update task status",
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
        const {success} = updateTaskInput.safeParse(body);
        if(!success) {
          c.status(411);
          return c.json({
            message : "Inputs are incorrect"
          });
        }
        const task = await prisma.task.findUnique({ where: { id } });
            if (!task) {
                return c.json({ message: `No task found with ID "${id}"`, success: false }, 404);
                }
                if (task.userId !== userId) {
                    return c.json({ message: "Permission denied", success: false }, 403);
                }    
        await prisma.task.update({
           where :{
            id : body.id
          },
           data :{
            title : body.title,
            description : body.description,
           },
        });

        return c.json({
            message : "Task update successfully",
            id : task.id
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
        where : {userId},
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
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
router.delete("/deletetask/:id" , async (c) => {
  try {
    const userId = c.get("userId");
    if(!userId) {
      return c.json({ message: "Unauthorized: Missing or invalid Bearer token" }, 401);
    }
    const idString = c.req.param('id');
    const id = parseInt(idString);
    if (isNaN(id)) {
      return c.json({ message: "Invalid task ID" }, 400);
    }

    await prisma.task.delete({
      where: { id },
    });

    return c.json({ message: "Task deleted successfully" }, 200);

  } catch (error) {
    console.error("Error deleting task:", error);
    return c.json({ message: "Failed to delete task" }, 500);
  }
});
    return router;

}