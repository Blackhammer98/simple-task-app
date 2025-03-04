

import {  useState } from "react";
import { Task } from "./Card";
import { UpdateIcon } from "./UpdateIcon";
import { DeleteIcon } from "./DeleteIcon";
import { UpdateTask } from "./UpdateTask";
import { DeleteTask } from "./DeleteTask";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";


interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onTaskChanged: () => void;
}

export const TaskModal = ({ task, onClose, onTaskChanged }: TaskModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTask , setLocalTask] = useState(task);
  const[error , setError] = useState<string>("");

  const handleStatusChange = async () => {
    const newStatus = localTask.status === "Completed" ? "Pending" : "Completed" ;

    try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        console.log("Task ID:", task.id);
            if (!token) {
                throw new Error("No authentication token found");
            } 
            const url = `${BACKEND_URL}/api/v1/task/taskstatus/${task.id}/status`;
            console.log("Request URL:", url);
        const response = await axios.patch(
            url,
            {status : newStatus},
            {headers : {Authorization: `Bearer ${token}`},
        }
        );
        console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      setLocalTask(response.data.data);
      onTaskChanged();

    } catch (err) {
        const error = err as AxiosError<{message?: string}>;
        console.error("Error details:", error.response?.data, error.response?.status);
        setError(error.response?.data?.message || "Failed to update task status");
    }
    }
  

  return <div>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{localTask.title}</h2>
          <div className="flex items-center space-x-2">
            <UpdateIcon onClick={() => setIsEditing(true)} />
            <DeleteIcon onClick={() => setIsDeleting(true)} />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2 text-gray-600">
          <p><strong>Description:</strong> {localTask.description}</p>
          <div className="flex items-center space-x-2">
          <input
              type="checkbox"
              id={`task-status-${task.id}`}
              name="task-status"
              checked={localTask.status === "Completed"}
              onChange={handleStatusChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <p><strong>Status:</strong> {localTask.status}</p>
          </div>
          
          <p><strong>Created:</strong> {new Date(localTask.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(localTask.updatedAt).toLocaleString()}</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {isEditing && (
          <UpdateTask
            task={localTask}
            onClose={() => setIsEditing(false)}
            onTaskUpdated={onTaskChanged}
          />
        )}
        {
            isDeleting && (
                <DeleteTask
                task={localTask}
                onClose={()=> setIsDeleting(false)}
                onTaskDeleted={onTaskChanged}
                />
            )
        }
       
      </div>
    </div>
  </div>
};