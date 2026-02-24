import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//  MUI cache provider for Next.js App Router (prevents style flicker + improves performance)
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

//  React Query provider (QueryClientProvider + caching config)
import ReactQueryProvider from "@/providers/ReactQueryProvider";

//  MUI theme setup
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";

//  Load Geist fonts and expose them as CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//  SEO metadata for the whole app
export const metadata: Metadata = {
  title: "Kanban Board - Task Management",
  description: "A modern Kanban board application for managing tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //  Apply the font CSS variables on the <html> element
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/*  Makes React Query available everywhere in the app */}
        <ReactQueryProvider>
          {/*  Ensures MUI styles are properly cached and injected with Next.js App Router */}
          <AppRouterCacheProvider options={{ key: "mui" }}>
            {/*  Provides MUI theme to all components */}
            <ThemeProvider theme={theme}>
              {/*  Normalizes CSS across browsers + applies MUI baseline styles */}
              <CssBaseline />

              {/*  Render the app pages/components */}
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}