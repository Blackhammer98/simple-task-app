import z from "zod"

export const signupInput = z.object({
    username : z.string(),
    email : z.string().email(),
    password : z.string().min(6),
})

export const signinInput = z.object({
    
    email : z.string().email(),
    password : z.string().min(6),
})

export const  createTaskInput =  z.object({
    title  :  z.string(),
    description : z.string(),

})

export const updateTaskInput = z.object({

    title : z.string(),
    description : z.string(),
    id : z.number()
})


export  type  SignupInput = z.infer<typeof signupInput>;
export  type  SigninInput = z.infer<typeof signinInput>;
export  type CreateTaskInput = z.infer<typeof createTaskInput>;
export  type UpdateTaskInput = z.infer< typeof updateTaskInput>