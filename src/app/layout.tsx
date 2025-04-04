import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import { ThemeProvider } from "@/Provider/themeProvider";
import { Toaster } from "sonner"
import ReactQueryProvider from "@/Provider/react-query-provider";
import ReduxProvider from "@/Provider/redux-provider";


const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">

      <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider
             attribute="class"
             defaultTheme="system"
             enableSystem
             disableTransitionOnChange
          >
          <ReduxProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </ReduxProvider>
            <Toaster/>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
