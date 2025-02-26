// src/App.tsx
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Tasks from "./pages/Tasks";
import { Task } from "./pages/Task";
import { UpdateTask } from "./pages/UpdateTask";
import { AddTask } from "./components/AddTask";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        
        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/:id" element={<Task />} />
          <Route path="/update/:id" element={<UpdateTask />} />
          <Route path="/addtask" element={<AddTask />} />
        
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;