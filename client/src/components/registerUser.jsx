import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const RegisterUser = () => {
    const navigate = useNavigate();
    const handleNavigate =  () => {
        navigate("/login");
    }

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
    });

    const handleChanges = (e) => {
        const {name, value} = e.target;

        setUserForm({
            ...userForm,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          // Registration request
          const response = await axios.post("http://localhost:3000/user/register", {
            email: userForm.email,
            name: userForm.name,
          });
      
          if (response.status === 200) {
            // Login request after successful registration
            try {
              const loginResponse = await axios.post("http://localhost:3000/user/login", {
                email: userForm.email,
              });
      
              if (loginResponse.status === 200) {
                localStorage.setItem("jwtoken", loginResponse.data.token);
                navigate("/dashboard");
              } else {
                console.error("Login failed", loginResponse.data);
              }
            } catch (error) {
              console.error("Error logging in", error);
            }
          } else {
            console.error("Registration failed", response.data);
          }
        } catch (error) {
          console.error("Error sending registration request:", error);
        }
      };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Registration Page
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={userForm.name}
                        onChange={handleChanges}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. John Doe"
                    />
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={userForm.email}
                        onChange={handleChanges}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. name@company.com"
                    />
                    </div>
                    <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Register
                    </button>
                    </div>
                    <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <a
                        onClick={handleNavigate}
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </a>
                    </p>
                </form>
            </div>
        </div>
    );
  };
  
  export default RegisterUser;