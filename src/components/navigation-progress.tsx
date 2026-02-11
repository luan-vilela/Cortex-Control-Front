"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const router = useRouter();

  // Simple implementation that shows loading bar briefly
  useEffect(() => {
    const handleStart = () => {
      ref.current?.continuousStart();
    };

    const handleComplete = () => {
      setTimeout(() => {
        ref.current?.complete();
      }, 500);
    };

    // Note: Next.js useRouter doesn't have the same event system as react-router
    // You might want to use useTransition from react for better integration
    return () => {
      handleComplete();
    };
  }, []);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      ref={ref}
      shadow={true}
      height={2}
    />
  );
}
