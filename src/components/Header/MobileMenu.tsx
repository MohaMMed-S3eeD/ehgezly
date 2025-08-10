"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";



interface MobileMenuProps {
  dashboardHref: string | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ dashboardHref }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Toggle menu"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-sm border-b shadow-lg z-50">
          <nav className="flex flex-col p-6 gap-1">
            <Link
              href="/"
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/profile"
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            {dashboardHref && (
              <Link
                href={dashboardHref}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
