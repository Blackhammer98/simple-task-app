import { Search, User } from "lucide-react"


export const TasksNavBar = () => {

    return <div>
            <div className="min-h bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Your Tasks</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200">Home</a>
              </div>
            </div>

            {/* Right side - Search and Avatar */}
            <div className="hidden sm:flex items-center">
              <div className="relative mx-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="ml-3 relative">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
       </nav>
      </div>
    </div>
    
}