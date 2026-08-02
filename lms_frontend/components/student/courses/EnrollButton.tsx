"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";


interface Props {
  slug: string;
}

export default function EnrollButton({ slug }: Props) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
  async function checkEnrollment() {
    try {
      const response = await api.get(
        `/courses/${slug}/enrollment/`
      );

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
    setLoading(true);

    try {
      const response = await api.post(`/courses/${slug}/enroll/`);

      alert(response.data.detail);
      setEnrolled(true);
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Something went wrong.";

      alert(message);

      if (message === "Already enrolled.") {
        setEnrolled(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="font-semibold shadow-sm"
      onClick={handleEnroll}
      disabled={checking || loading || enrolled}
    >
      {checking
        ? "Checking..."
        : loading
        ? "Enrolling..."
        : enrolled
        ? "Enrolled"
        : "Enroll Now"}
    </Button>
  );
}