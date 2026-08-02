"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    // Save login data
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    login(data.user); 

    alert("Login successful!");

    router.push("/students");

  } catch (error) {
    console.error(error);
    alert("Unable to connect to server.");
  }
}

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">

        <input
          className="border p-3 w-full"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          className="border p-3 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white p-3 rounded w-full"
        >
          Login
        </button>

      </form>
    </div>
  );
}