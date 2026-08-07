"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionUuid = searchParams.get("transaction_uuid");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 text-center shadow-lg border">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-slate-800">Payment Unsuccessful</h2>
            <p className="text-sm text-muted-foreground">
              Your transaction was canceled or failed to process with eSewa. No funds were debited for this attempt.
            </p>

            {transactionUuid && (
              <div className="rounded-md bg-muted p-2 text-xs font-mono text-muted-foreground w-full break-all">
                Reference ID: {transactionUuid}
              </div>
            )}

            <div className="flex flex-col gap-2 w-full pt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                onClick={() => router.back()}
              >
                <RefreshCw className="h-4 w-4" />
                Try Payment Again
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => router.push("/students/courses")}
              >
                <ArrowLeft className="h-4 w-4" />
                Browse All Courses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}