import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/teacher/AppSidebar";
import Navbar from "@/components/teacher/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body>
        <AuthProvider>
        <ThemeProvider  attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SidebarProvider defaultOpen={defaultOpen}>
          {/* <AppSidebar /> */}
          <main className="w-full">
            {/* <Navbar /> */}
            <div className="px-4">{children}</div>
          </main>
          </SidebarProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
