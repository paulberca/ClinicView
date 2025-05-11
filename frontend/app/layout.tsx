import "./globals.css";
import { ConnectionErrorProvider } from "@/contexts/ConnectionErrorContext";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/layoutWrapper.module.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 💡 Hack to disable Sidebar on auth pages
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body>
        <ConnectionErrorProvider>
          <div className={styles.container}>
            {!isAuthPage && <Sidebar />}
            <main className={styles.mainContent}>{children}</main>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </ConnectionErrorProvider>
      </body>
    </html>
  );
}
