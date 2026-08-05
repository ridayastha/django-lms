"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import api from "@/lib/axios";

export default function MarkCompleteButton({
  lessonId,
}: {
  lessonId: number;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    try {
      setLoading(true);

      await api.post(`/lessons/${lessonId}/complete/`);

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={loading}
      size="lg"
      className="gap-2"
    >
      <CheckCircle2 className="h-5 w-5" />

      {loading ? "Completing..." : "Mark Complete"}
    </Button>
  );
}