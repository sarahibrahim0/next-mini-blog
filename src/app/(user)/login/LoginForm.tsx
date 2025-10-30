"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // 👈 أيقونات لطيفة من مكتبة lucide-react

// ✅ 1. تعريف الـ Schema
const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string()});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ 2. إعداد React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ 3. Submit Handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      await axios.post("/api/users/login", data, {
        withCredentials: true, // 👈 عشان الكوكي يتبعت ويتسجل في الـ browser
      });
      toast.success("Login successful!");
      router.replace("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {/* EMAIL */}
      <input
        className="mb-2 border rounded p-2 text-xl"
        type="email"
        placeholder="Enter Your Email"
        {...register("email")}
      />
      {errors.email && (
        <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
      )}

      {/* PASSWORD */}
      <div className="relative mb-2">
        <input
          className="w-full border rounded p-2 pr-10 text-xl"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          {...register("password")}
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-600"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1} // عشان ميتأثرش بالتنقل بين الحقول
        >
          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>
      )}

      {/* SUBMIT */}
      <button
        disabled={isSubmitting}
        type="submit"
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
