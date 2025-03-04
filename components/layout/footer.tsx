import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-foreground text-sm">
              © {new Date().getFullYear()} StockSim. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-sm text-primary hover:text-blue-600"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-primary hover:text-blue-600"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-primary hover:text-blue-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
