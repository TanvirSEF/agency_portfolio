"use client";

import ClickSpark from "@/components/ClickSpark";

export default function ClickSparkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark
      sparkColor="#8C52FF"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      style={{ height: "auto" }}
    >
      <div className="flex min-h-screen flex-col">{children}</div>
    </ClickSpark>
  );
}
