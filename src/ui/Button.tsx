"use client";

import { Slot } from "@radix-ui/react-slot";

export default function Button({
  children,
  asChild = false,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      {...props}
    >
      {children}
    </Comp>
  );
} 