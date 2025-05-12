import "./globals.css";
import { ConnectionErrorProvider } from "@/contexts/ConnectionErrorContext";
import LayoutWrapper from "@/components/LayoutWrapper"; // client-side logic
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConnectionErrorProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-right" reverseOrder={false} />
        </ConnectionErrorProvider>
      </body>
    </html>
  );
}
