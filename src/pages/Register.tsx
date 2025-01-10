import { useForm } from "react-hook-form";
import { RegisterCredentials } from "../types/auth";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Register() {
  const { register: userRegister } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterCredentials>();

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(userRegister)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 px-2 py-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving data..." : "Register"}
        </button>
      </form>
      <div className="mt-2 flex justify-center">
        <span>
          Already have an account?{" "}
          <Link
            className="text-indigo-600 hover:underline hover:underline-offset-4"
            to="/login"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}
