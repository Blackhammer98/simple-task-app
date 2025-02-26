
export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    status : string;
   
  }

export const Card = ({task}:{task : Task}) => {
 

    return <div>
         <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
           task.status === "Completed"
           ? "bg-green-100 text-green-800"
           : task.status === "In Progress"
           ? "bg-blue-100 text-blue-800"
           : task.status === "Pending"
           ? 'bg-blue-100 text-blue-800'
            :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {task.status || "unknown"}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-1">
          {task.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm">
          
        </div>
      </div>
    </div>
    </div>
}
