"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // 👈 icons for show/hide password

// ✅ Zod validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ React Hook Form setup with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // run validation when user leaves input
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      console.log(data);
      await axios.post("/api/users/register", data);
      toast.success("Registered successfully!");
      router.replace("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-80">
      {/* Username */}
      <input
        className="mb-2 border rounded p-2 text-xl"
        type="text"
        placeholder="Enter Your Username"
        {...register("username")}
      />
      {errors.username && (
        <p className="text-red-500 text-sm mb-2">{errors.username.message}</p>
      )}

      {/* Email */}
      <input
        className="mb-2 border rounded p-2 text-xl"
        type="email"
        placeholder="Enter Your Email"
        {...register("email")}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
      )}

      {/* Password */}
      <div className="relative mb-2">
        <input
          className="w-full border rounded p-2 text-xl pr-10"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
      )}

      {/* Submit button */}
      <button
        disabled={loading}
        type="submit"
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
      >
        {loading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
