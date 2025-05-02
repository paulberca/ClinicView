"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { name: "Patients", href: "/patients" },
  { name: "Stats", href: "/stats" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.sidebarTitle}>Hospital Management</h1>
      <nav>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={
                  pathname.startsWith(item.href)
                    ? styles.navLinkActive
                    : styles.navLink
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
