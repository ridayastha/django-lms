"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [courseSlug, setCourseSlug] = useState("");

  useEffect(() => {
    // eSewa v2 appends ?data=encoded_base64_string to success_url
    const data = searchParams.get("data");

    if (!data) {
      setStatus("failed");
      setErrorMessage("No payment response data found in URL.");
      return;
    }

    async function verifyPayment() {
      try {
        const response = await api.post("/payments/verify/", { data });

        setStatus("success");
        const slug = response.data.course_slug;
        setCourseSlug(slug);

        // Automatically redirect to the course page after 2.5 seconds
        if (slug) {
          setTimeout(() => {
            router.push(`/students/courses/${slug}`);
          }, 2500);
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setErrorMessage(
          error.response?.data?.error ||
            error.response?.data?.detail ||
            "Payment verification failed or invalid signature."
        );
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 text-center shadow-lg border">
        <CardContent className="pt-6 space-y-4">
          {/* VERIFYING STATE */}
          {status === "verifying" && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-green-600" />
              <h2 className="text-xl font-semibold">Verifying Payment...</h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we confirm your transaction with eSewa. Do not close or refresh this page.
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <div className="flex flex-col items-center space-y-3">
              <CheckCircle className="h-14 w-14 text-green-600" />
              <h2 className="text-2xl font-bold text-green-700">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground">
                You have successfully enrolled in the course. Redirecting to your course dashboard...
              </p>
              {courseSlug && (
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700"
                  onClick={() => router.push(`/students/courses/${courseSlug}`)}
                >
                  Go to Course Now
                </Button>
              )}
            </div>
          )}

          {/* FAILED STATE */}
          {status === "failed" && (
            <div className="flex flex-col items-center space-y-3">
              <XCircle className="h-14 w-14 text-red-600" />
              <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
              <p className="text-sm text-red-500">{errorMessage}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => router.push("/students/courses")}
              >
                Back to Courses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Next.js App Router requires `useSearchParams` to be wrapped inside a Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}