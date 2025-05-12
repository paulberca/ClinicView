"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/layoutWrapper.module.css";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className={styles.container}>
      {!isAuthPage && <Sidebar />}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
