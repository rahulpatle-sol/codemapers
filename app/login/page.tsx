"use client";

import type { NextRequest } from "next/server";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-sm w-full text-center border border-white/20 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-gray-300">Sign  in to  start code 👨‍💻</p>

        <button
          onClick={() => signIn("github")}
          className="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={() => signIn("google")}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
