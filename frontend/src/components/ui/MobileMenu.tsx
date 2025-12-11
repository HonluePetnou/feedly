import * as React from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, navLinks }) => {
  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        aria-hidden="true"
      />
      {/* Menu Bar */}
      <nav
        className={cn(
          "fixed inset-0 z-100 bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 flex flex-col w-full h-full",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        style={{ top: 0 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="text-2xl font-bold">×</button>
        </div>
        <div className="flex justify-end px-4 pt-2 pb-0">
          {/* Theme Switcher */}
          <ModeToggle />
        </div>
        <ul className="flex-1 flex flex-col gap-2 p-4 bg-white dark:bg-zinc-900">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block w-full px-3 py-2 rounded-lg text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={onClose}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
