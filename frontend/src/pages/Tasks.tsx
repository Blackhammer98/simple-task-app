import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { Card, Task } from "../components/Card";
import { AddTask } from "../components/AddTask";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<{ message: string; data: Task[] }>(
          `${BACKEND_URL}/api/v1/task/getalltasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Tasks response:", response.data);
        setTasks(response.data.data);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || "Failed to fetch tasks");
        setLoading(false);
      }
    };
  useEffect(()=>{
    fetchTasks();
  },[]);

  const handleTaskAdded = () => {
   fetchTasks();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-100">
        <p className="text-xl text-gray-700 animate-pulse">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-100 py-8 px-4 flex flex-col  ">
      <div className=" w-full mx-auto  pb-20  ">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Tasks</h1>
          <AddTask onTaskAdded={handleTaskAdded}/*here onTaskAdded fucntion used as prop and trigger handletaskAdded to call fetchTasks after update */ /> 
        </div>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No tasks found. Start by adding one!
        </p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </div>
      )}
    
      </div>
    </div>
    
  );
};

export default Tasks;