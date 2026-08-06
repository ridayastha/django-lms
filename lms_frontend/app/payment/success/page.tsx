"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    async function verifyPayment() {
      const data = searchParams.get("data");

      if (!data) {
        setMessage("Payment data not found.");
        return;
      }

      try {
        const response = await api.post("/payments/verify/", {
          data,
        });

        setMessage("Payment verified successfully!");

        setTimeout(() => {
          router.replace(
            `/students/courses/${response.data.course_slug}`
          );
        }, 1500);
      } catch (error: any) {
        console.error(error);

        setMessage(
          error.response?.data?.error ??
            "Payment verification failed."
        );
      }
    }

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="rounded-xl border p-8 shadow">
        <h1 className="text-2xl font-bold mb-4">
          Payment Status
        </h1>

        <p>{message}</p>
      </div>
    </div>
  );
}