import { SignupInput } from "@nikit086/task-common";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState} from "react";
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";



export const Auth = ({type}:{type : "signup" | "signin"}) => {

    const [postInputs , setPostInputs] = useState<SignupInput>({
        username : "",
        email : "",
        password : "",
    });
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

  const handleSubmit = async (e : FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
            postInputs
        );

       if (type === "signin") {
        const token = response.data.token;
        if (!token) {
          throw new Error("No token received from server");
        }
        localStorage.setItem("token", token);
        console.log("Stored token:", localStorage.getItem("token")); 
      }

        navigate(type === "signup" ? "/signin" : "/tasks");

    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || `Failed to ${type}`);
    }

  }

    return <div className=" h-screen flex justify-center flex-col px-6 py-12 lg:px-8">
       
            <div className="flex justify-center  " >
                <div>
                <div className="px-12">
                <h2 className="mt-10 text-center text-3xl font-semibold">
                    {type === "signup" ? "Create an account" : "Sign to an account"}
                    </h2>
                <div className="text-gray-500 font-small">
                    {type === "signin" ? "Don't have an account" : "Already have an account?"}
                     <Link className="pl-2 underline" to={type === "signin" ?"/signup" : "/signin"}>
                     {type === "signin" ? "Sign up" : "Sign in"}
                     </Link> 
                </div>
                </div>
                    <form onSubmit={handleSubmit} className="mt-5">
                    <LabelledInput label="Username" placeholder="usrname012" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username : e.target.value
                        })
                    }}/>
                    <LabelledInput label="email" placeholder="name@example.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email : e.target.value
                        })
                    }}/>
                    <LabelledInput label="password" type={"password"} placeholder="0123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password : e.target.value
                        })
                    }}/>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button type="submit" className="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
                     focus:ring-gray-300  font-medium rounded-lg text-lg mt-5 px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
                    dark:focus:ring-gray-700 dark:border-gray-700 ">{type === "signup" ? "Sign up" : "Sign in" } </button>
                </form>
               </div>
            </div>
    </div>
} 

interface LabelledInputType {
    label :string ;
    placeholder : string;
    onChange : (e : ChangeEvent<HTMLInputElement>) => void;
    type? :string;
}

function LabelledInput ({label , placeholder , onChange ,type } : LabelledInputType ) {
    return <div>
         <div>
            <label  className="block mb-2 text-lg font-medium text-black pt-4">{label}</label>
            <input onChange={onChange} type={type || "text"} className="bg-gray-50 border border-gray-300 text-red-900 text-sm rounded-lg
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
              dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
               dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}