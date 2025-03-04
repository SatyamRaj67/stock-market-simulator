"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If the user is not logged in, only show login/signup links
  if (!session) {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Stock Market Simulator
          </Link>
          <div className="flex items-center space-x-2 text-foreground dark:bg-background dark:text-foreground">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button
              className=" text-white dark:bg-background dark:text-primary dark:hover:bg-muted"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  const isAdmin =
    session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN";

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/market", label: "Market" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">
            Stock Market Simulator
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname?.startsWith(item.href) ? " font-medium" : "  "
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/profile" className="">
              {session.user?.name || session.user?.email}
            </Link>
            <Button
              variant="outline"
              className="hover:bg-destructive hover:text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
