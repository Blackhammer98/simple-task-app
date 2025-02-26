import { CreateTaskInput } from "@nikit086/task-common";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { BACKEND_URL } from "../config";

interface AddTaskProps {
  onTaskAdded : () => void;
}

export const AddTask = ({onTaskAdded} : AddTaskProps) => {

  const[taskInputs , setTaskInputs]  = useState<CreateTaskInput>({
    title : "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onHandleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError("");

    try {

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.post(`${BACKEND_URL}/api/v1/task/addtask`,
        taskInputs,
        {
          headers: { Authorization: `Bearer ${token}` }, // Add token here
        }
      );
      if(response) {
        
        if(!token){
          throw new Error("No authentication token found !")
        }
      }
     
      setIsOpen(false); // Close form
      onTaskAdded(); // fucntion used as prop to notify parent to update Tasks
      
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Failed to create task");
    }
  };


  return <div>
          <div className="flex py-10 px-10 ">
            {!isOpen ? (
                <button
                onClick={() => setIsOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                Add Task
                </button>
            ):(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Task</h2>
                <form onSubmit={onHandleSubmit} className="space-y-4">
              <div>
                <TaskIabbeledInput label="Title" placeholder="Add title to your task" onChange={(e) => {
                  setTaskInputs({
                    ...taskInputs,
                     title : e.target.value
                  })
                }}/>
                <TaskIabbeledInput label="Description" placeholder="Add Description of your task" rows={10} onChange={(e) => {
                  setTaskInputs({
                    ...taskInputs,
                     description : e.target.value
                  })
                }}/>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
          )}
     </div>
  </div>
}

interface TaskLabbeledInputType {
   label :string ;
  placeholder : string;
  onChange : (e : ChangeEvent<HTMLTextAreaElement>) => void;
  type? :string;
  rows? : number
}

function TaskIabbeledInput ({label , placeholder ,onChange , rows , type} : TaskLabbeledInputType) {
  return <div>
        
<label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
<textarea onChange={onChange}  rows={rows} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border
 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
   placeholder={placeholder}></textarea>

  </div>
}