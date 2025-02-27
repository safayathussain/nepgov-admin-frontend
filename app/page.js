"use client";
import Login from "@/components/auth/Login";
import { useAuth } from "@/utils/functions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?._id) {
      router.push("/crimes");
    }
  }, [auth, router]);  

  return (
    <div>
      {!auth?._id && <Login />}
    </div>
  );
}
