import "./globals.css";
import { ConnectionErrorProvider } from "@/contexts/ConnectionErrorContext";
import ConnectionErrorModal from "@/components/ConnectionErrorModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConnectionErrorProvider>
          {children}
          <ConnectionErrorModal />
        </ConnectionErrorProvider>
      </body>
    </html>
  );
}
