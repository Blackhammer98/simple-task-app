import axios, { AxiosError } from "axios";
import { ChangeEvent, useState } from "react";
import {Task} from "./Card";
import { UpdateTaskInput } from "@nikit086/task-common";
import { BACKEND_URL } from "../config";

interface UpdateTaskProps {
task : Task ;
onClose : () => void ;
onTaskUpdated : () => void;
}

export const UpdateTask = ({task , onClose , onTaskUpdated} : UpdateTaskProps) => {
const [updateTaskInputs , setUpdateTaskInputs ] = useState<UpdateTaskInput>({

    title : task.title,
    description :task.description,
    id: task.id
});

const [error , setError] = useState<string>("");

const handleUpdate = async (e : React.FormEvent) => {
    e.preventDefault;
    setError("");


try {
    const token = localStorage.getItem("token");
    if(!token) {
        throw new Error("No authenication token found!")
    }

    const Response = await axios.put(`${BACKEND_URL}/api/v1/task/updatetask/${task.id}`,
        updateTaskInputs,
        {
            headers: { Authorization: `Bearer ${token}` },
        }  
    );
    console.log("updated Task :", Response.data.data);
    onTaskUpdated();
    onClose();
    
} catch (err) {
    const error = err as AxiosError<{message?: string}>;
    setError(error.response?.data?.message || "Failed to update task");
}
};

    return  <div>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Task</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
          <UpdateTaskLabbeledInput label ="Title" placeholder="Add title to your task" onChange={(e) => {
                  setUpdateTaskInputs({
                    ...updateTaskInputs,
                     title : e.target.value
                  })
                }}/>
          </div>
          <div>
          <UpdateTaskLabbeledInput label="Description" placeholder="Add Description of your task" rows={10} onChange={(e) => {
                  setUpdateTaskInputs({
                    ...updateTaskInputs,
                     description : e.target.value
                  })
                }}/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    
};



interface UpdateTaskLabbeledInputType {
   label :string ;
  placeholder : string;
  onChange : (e : ChangeEvent<HTMLTextAreaElement>) => void;
  type? :string;
  rows? : number
}

function UpdateTaskLabbeledInput ({label , placeholder ,onChange , rows , } : UpdateTaskLabbeledInputType) {
  return <div>
        
<label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
<textarea onChange={onChange}  rows={rows} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border
 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
   placeholder={placeholder}></textarea>

  </div>
}