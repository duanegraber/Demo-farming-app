"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/livestock", label: "Livestock" },
  { href: "/farming", label: "Farming" },
  { href: "/equipment", label: "Equipment" },
  { href: "/activity", label: "Activity" },
  { href: "/admin", label: "Admin" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {links.map((link) => {
        const isActive = link.href === "/"
          ? pathname === "/"
          : pathname.startsWith(link.href) || (link.href === "/livestock" && pathname.startsWith("/cows"));
        return (
          <Link className={isActive ? "active" : ""} href={link.href} key={link.href}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
