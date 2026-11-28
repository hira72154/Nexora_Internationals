
import type { Metadata } from "next";
import "./globals.css";
import WireBackground from "@/components/three/WireBackground";

export const metadata: Metadata = {
  title: "Nexora Technology | The Next Era of Innovation",
  description:
    "Discover Nexora Technology — intelligent automation, web development and digital solutions for modern businesses.",
  keywords: [
    "Nexora Technology",
    "AI Automation",
    "Web Development",
    "Digital Transformation",
    "Technology Solutions",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WireBackground />

        <div className="site-layer">
          {children}
        </div>
      </body>
    </html>
  );
}
