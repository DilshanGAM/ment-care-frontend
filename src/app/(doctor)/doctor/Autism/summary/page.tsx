"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DepressionSummaryContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Depression Summary</h1>
            {email ? (
                <p className="text-lg">Showing summary for: <span className="font-medium">{email}</span></p>
            ) : (
                <p className="text-lg text-red-500">No email provided in the URL!</p>
            )}
        </div>
    );
}

export default function DepressionSummaryPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading summary...</div>}>
            <DepressionSummaryContent />
        </Suspense>
    );
}
