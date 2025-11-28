"use client";

import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/mode-toggle";
import { Plus, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/apps/new">
          <Button
            size="sm"
            className="hidden sm:flex gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Add Application
          </Button>
        </Link>
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-muted/50"
        >
          <User className="size-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  );
}
