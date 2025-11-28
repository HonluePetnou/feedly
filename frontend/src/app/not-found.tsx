"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/mode-toggle";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-primary/10 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {/* Grid pattern if available in globals, otherwise subtle overlay */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 z-50">
        <div className="flex items-center gap-2">
          <div className="size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xl font-bold">Feedly</span>
        </div>
        <ModeToggle />
      </header>

      <main className="text-center p-8 relative z-10 max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="p-6 rounded-full bg-primary/10 ring-1 ring-primary/20 animate-pulse">
            <FileQuestion className="size-16 text-primary" />
          </div>
        </div>

        <h2 className="text-8xl font-black mb-4 bg-linear-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
          404
        </h2>

        <h3 className="text-2xl font-bold mb-4">Page Not Found</h3>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-primary/20"
            >
              Return Home
            </Button>
          </Link>
          <Link href="/contact" className="inline-block w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contact Support
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Feedly. All rights reserved.
      </footer>
    </div>
  );
}
