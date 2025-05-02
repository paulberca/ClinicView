import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ConnectionErrorProvider } from "@/contexts/ConnectionErrorContext";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConnectionErrorProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
              {children}
            </main>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </ConnectionErrorProvider>
      </body>
    </html>
  );
}
