"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ComponentShowcase({
  title,
  description,
  children,
}: ComponentShowcaseProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gh-text-secondary mt-1">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
