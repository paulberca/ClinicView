"use client";
import styles from "@/styles/sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.sidebarTitle}>Hospital Management</h1>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a
              href="#"
              className={clsx(
                styles.navLink,
                pathname.startsWith("/patients") && styles.navLinkActive
              )}
              onClick={(e) => {
                e.preventDefault();
                router.push("/patients");
              }}
            >
              Patients
            </a>
          </li>
          <li className={styles.navItem}>
            <a
              href="#"
              className={clsx(
                styles.navLink,
                pathname.startsWith("/doctors") && styles.navLinkActive
              )}
              onClick={(e) => {
                e.preventDefault();
                router.push("/doctors");
              }}
            >
              Doctors
            </a>
          </li>
          <li className={styles.navItem}>
            <a
              href="#"
              className={clsx(
                styles.navLink,
                pathname.startsWith("/stats") && styles.navLinkActive
              )}
              onClick={(e) => {
                e.preventDefault();
                router.push("/stats");
              }}
            >
              Stats
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
