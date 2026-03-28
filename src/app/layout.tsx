import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/Sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { AutoLogout } from "@/components/AutoLogout";

const outfit = Outfit({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Resumate - AI Resume Builder & Career Coach",
  description: "Build professional resumes with AI assistance and get personalized career coaching. Optimize for ATS, get real-time feedback, and land your dream job.",
  keywords: ["resume builder", "AI resume", "career coach", "ATS optimization", "job application"],
  authors: [{ name: "Resumate" }],
  creator: "Resumate",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preconnect to external services */}
          <link rel="preconnect" href="https://api.groq.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={outfit.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Skip to main content - Accessibility */}
            <a
              href="#main-content"
              className="skip-link"
            >
              Skip to main content
            </a>
            
            <AutoLogout />
            
            {/* Main content wrapper with ID for skip link */}
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
            
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: "bg-zinc-900 border-zinc-800 text-white",
                duration: 4000,
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}