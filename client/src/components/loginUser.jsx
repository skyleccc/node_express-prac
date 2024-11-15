import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginUser = () => {
    const navigate = useNavigate();
    const handleNavigateRegister = () => {
        navigate("/register");
    };

    const [userForm, setUserForm] = useState({
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
    const response = await axios.post("http://localhost:3000/user/login", userForm, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    
    if (response.status === 200) {
      localStorage.setItem("jwtoken", data.token);
      navigate("/dashboard");
    } else {
      console.error("Login failed", data);
    }
  } catch (error) {
    console.error("Error sending request:", error);
  }
};

    return (
        <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Login Page
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                        Login
                    </button>
                    </div>
                    <p className="text-sm text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <a
                        onClick={handleNavigateRegister}
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </a>
                    </p>
                </form>
            </div>
        </div>
    );
  };
  
  export default LoginUser;
  