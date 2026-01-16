import type { ReactNode } from "react";

// This is required for next-intl with App Router
// The actual layout is in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
