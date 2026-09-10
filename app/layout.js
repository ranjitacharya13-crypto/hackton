import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/components/providers/app-provider";
import "./globals.css";

export const metadata = {
  title: "Lumina Health — AI-Powered Personal Health Management",
  description:
    "Connect your health records, reports, medications, vitals and appointments in one secure, role-aware AI experience. Frontend prototype with mock data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <MotionConfig reducedMotion="user">
          <TooltipProvider delayDuration={200}>
            <AppProvider>{children}</AppProvider>
          </TooltipProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
