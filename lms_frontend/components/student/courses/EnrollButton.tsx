"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Props {
  courseId: number | string;
  slug: string;
  price?: number;
}

export default function EnrollButton({
  courseId,
  slug,
  price = 0,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkEnrollment() {
      try {
        const response = await api.get(`/courses/${slug}/enrollment/`);
        setEnrolled(response.data.enrolled);
      } catch (error) {
        console.error("Failed to check enrollment:", error);
      } finally {
        setChecking(false);
      }
    }

    checkEnrollment();
  }, [slug]);

  async function handleEnroll() {
    if (!courseId) {
      alert("Error: courseId is missing.");
      return;
    }

    setLoading(true);

    try {
      // ============================
      // FREE COURSE
      // ============================
      if (price <= 0) {
        await api.post(`/courses/${slug}/enroll/`);

        setEnrolled(true);

        // Redirect to course page
        router.push(`/students/courses/${slug}`);

        return;
      }

      // ============================
      // PAID COURSE
      // ============================
      const response = await api.post("/payments/initiate/", {
        course_id: courseId,
      });

      const esewaData = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(esewaData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error(error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Something went wrong.";

      alert(message);

      if (message === "You are already enrolled in this course.") {
        setEnrolled(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={handleEnroll}
      disabled={checking || loading || enrolled}
    >
      {checking
        ? "Checking..."
        : loading
        ? price > 0
          ? "Redirecting to eSewa..."
          : "Enrolling..."
        : enrolled
        ? "Enrolled"
        : price > 0
        ? `Pay Rs. ${price} with eSewa`
        : "Enroll for Free"}
    </Button>
  );
}