import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ConnectionErrorProvider } from "@/contexts/ConnectionErrorContext";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/layoutWrapper.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConnectionErrorProvider>
          <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>{children}</main>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </ConnectionErrorProvider>
      </body>
    </html>
  );
}
