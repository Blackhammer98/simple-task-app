import axios, { AxiosError } from "axios";
import { useState } from "react"
import { BACKEND_URL } from "../config";
import { Task } from "../components/Card";


interface DeleteTaskProps {
    task: Task; // Task to delete
    onClose: () => void; // Close the modal
    onTaskDeleted: () => void; // Notify parent to refresh
  }

export const DeleteTask = ({task , onClose ,onTaskDeleted}: DeleteTaskProps) => {
    
    const [error , setError] =useState<string>("");
      
    const handleDelete = async () => {
     
        try {
            const token = localStorage.getItem("token");
            if(!token) {
                throw new Error("No authentication token found");
            }

            await axios.delete(`${BACKEND_URL}/api/v1/task/deletetask/${task.id}` ,{
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`Task ${task.id} deleted`);
            onTaskDeleted(); // Trigger refresh
            onClose();
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Failed to delete task");
        }
    };

    return <div>
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Task</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{task.title}"? This action cannot be undone.
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    </div>
}