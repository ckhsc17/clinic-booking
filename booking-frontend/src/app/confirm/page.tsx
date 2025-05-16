// /app/confirm/page.tsx
"use client";
import { Suspense } from "react";
import ConfirmModalClient from "./ConfirmModalClient";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmModalClient />
    </Suspense>
  );
}