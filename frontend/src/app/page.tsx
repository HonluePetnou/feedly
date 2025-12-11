"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/ui/MobileMenu";

import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-linear-to-b from-background to-background/95">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-cyan-500/10 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <div className="flex items-center gap-3 group">
            <div className="size-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
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
            <h2 className="text-xl font-bold leading-tight tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Feedly
            </h2>
          </div>

          <nav className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <ModeToggle />
              <Link href="/signup">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Try for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>

          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navLinks={[
            { label: "Features", href: "#features" },
            { label: "How it Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "/contact" },
            { label: "Try for Free", href: "/signup" },
            { label: "Sign In", href: "/login" },
          ]}
        />
      </header>

      <main className="flex-1 mx-4 md:mx-8 lg:mx-16 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pb-12 md:pb-20 pt-0">
          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            <div className="w-full md:w-1/2 relative group md:self-center order-2">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-cyan-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative aspect-video sm:h-[360px] md:h-[520px] lg:h-[560px] w-full rounded-2xl bg-muted/20 shadow-2xl shadow-primary/20 border border-primary/20 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/whitecapture.png"
                  alt="Feedly dashboard preview (light)"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/blackcapture.png"
                  alt="Feedly dashboard preview (dark)"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain hidden dark:block"
                />
                <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,black)]" aria-hidden="true" />
              </div>
              {/* Floating Cards Around Screenshot */}
              <div className="pointer-events-none select-none">
                {/* Notification Card */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fade-in-up">
                  <div className="bg-background/90 shadow-xl rounded-2xl px-6 py-3 border border-border/60 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary text-white font-bold">N</span>
                    <div>
                      <div className="font-semibold text-sm">New Notification</div>
                      <div className="text-xs text-muted-foreground">You have 3 new reviews</div>
                    </div>
                  </div>
                </div>
                {/* Feature List Card */}
                <div className="absolute bottom-4 -left-32 hidden md:block animate-fade-in-left">
                  <div className="bg-background/95 shadow-lg rounded-xl border border-border/60 px-5 py-4 w-56">
                    <div className="font-bold mb-2 text-primary">Features</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>AI Sentiment Analysis</li>
                      <li>Bug Detection</li>
                      <li>Odoo Integration</li>
                      <li>Real-time Alerts</li>
                    </ul>
                  </div>
                </div>
                {/* Stats Card */}
                <div className="absolute bottom-8 -right-32 hidden md:block animate-fade-in-right">
                  <div className="bg-background/95 shadow-lg rounded-xl border border-border/60 px-6 py-4 w-48">
                    <div className="text-lg font-bold text-primary mb-1">10K+</div>
                    <div className="text-xs text-muted-foreground mb-2">Reviews Analyzed</div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium"><span className="size-2 rounded-full bg-cyan-500 inline-block"></span> 98% Accuracy</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium"><span className="size-2 rounded-full bg-emerald-500 inline-block"></span> 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8 md:w-1/2 order-1">
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-medium text-primary">
                    AI-Powered Analytics
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                  Automate Google Play{" "}
                  <span className="bg-linear-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                    Review Analysis
                  </span>{" "}
                  with AI
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Unlock actionable insights from your user reviews. Our
                  platform provides AI analysis, bug detection, and seamless
                  Odoo integration to help you build better apps.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="inline-block">
                  <Button
                    size="lg"
                    className="text-base shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group"
                  >
                    Try the Dashboard
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base hover:bg-primary/5 border-primary/20"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Reviews Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Challenge App Developers Face
              </h2>
              <p className="text-lg text-muted-foreground">
                Managing user feedback shouldn't be overwhelming
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Problem 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Too Many Reviews</h3>
                <p className="text-muted-foreground">
                  Thousands of reviews flooding in daily, impossible to read
                  them all manually
                </p>
              </div>

              {/* Problem 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Hard to Extract Insights
                </h3>
                <p className="text-muted-foreground">
                  Buried valuable feedback mixed with spam, difficult to
                  identify patterns
                </p>
              </div>

              {/* Problem 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Time-Consuming Manual Work
                </h3>
                <p className="text-muted-foreground">
                  Hours spent categorizing, analyzing, and tracking competitor
                  reviews manually
                </p>
              </div>
            </div>

            {/* Solution Teaser */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-sm font-medium text-primary">
                  Feedly automates all of this with AI
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 py-12 md:py-20"
        >
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4 text-center items-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-medium text-primary">
                  FEATURES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Powerful Features to{" "}
                <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                  Elevate Your App
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Our platform is packed with tools to help you understand your
                users and improve your product.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ),
                  title: "AI Review Analysis",
                  description:
                    "Leverage AI for sentiment and topic analysis on every review with 98% accuracy.",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ),
                  title: "Automated Bug Detection",
                  description:
                    "Automatically flag potential bugs and critical user issues before they escalate.",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  ),
                  title: "Interactive Dashboard",
                  description:
                    "A unified, interactive dashboard for all your review data with real-time updates.",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  ),
                  title: "Intelligent Chatbot",
                  description:
                    "Get instant insights and answers with our AI-powered chatbot assistant.",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  ),
                  title: "Odoo Integration",
                  description:
                    "Seamlessly connect and sync data with your Odoo workflow in real-time.",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Real-time Alerts",
                  description:
                    "Get notified instantly when critical issues are detected in your reviews.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="container mx-auto px-4 py-12 md:py-20 relative"
        >
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent -z-10" />

          <div className="flex flex-col gap-16 items-center">
            <div className="flex flex-col gap-4 text-center max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                <span className="text-xs font-medium text-primary">
                  HOW IT WORKS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Simple 3-Step Process
              </h2>
              <p className="text-lg text-muted-foreground">
                Transform your user feedback into actionable insights in
                minutes.
              </p>
            </div>

            <div className="w-full max-w-4xl">
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Connect Your Google Play Account",
                    description:
                      "Securely link your developer account in just a few clicks with our OAuth integration.",
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    ),
                  },
                  {
                    step: "02",
                    title: "AI Analyzes Your Reviews",
                    description:
                      "Our advanced AI engine processes reviews for sentiment, topics, and bugs in real-time.",
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    ),
                  },
                  {
                    step: "03",
                    title: "Get Actionable Insights",
                    description:
                      "Explore your interactive dashboard and start improving your app with data-driven decisions.",
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    ),
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center size-16 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      {index < 2 && (
                        <div className="w-[2px] bg-linear-to-b from-primary to-transparent h-12 group-hover:from-primary/50 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-primary">{item.icon}</div>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col gap-12 items-center">
            <div className="text-center flex flex-col gap-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                <span className="text-xs font-medium text-primary">
                  DASHBOARD
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Explore the Dashboard
              </h2>
              <p className="text-lg text-muted-foreground">
                Get a glimpse of our clean, intuitive interface designed for
                clarity and action.
              </p>
            </div>

            <div className="w-full relative group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-cyan-500/20 rounded-2xl blur-3xl group-hover:blur-[100px] transition-all duration-500" />
              <div className="relative w-full aspect-video rounded-2xl border border-primary/20 bg-muted/50 backdrop-blur-sm shadow-2xl shadow-primary/10 overflow-hidden">
                <Image
                  src="/whitecapture.png"
                  alt="Dashboard preview (light)"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/blackcapture.png"
                  alt="Dashboard preview (dark)"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain hidden dark:block"
                />
                <div className="absolute inset-0 bg-grid-white/5 mask-[linear-gradient(0deg,transparent,black)]" aria-hidden="true" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Live Dashboard Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-xs font-medium text-primary">
                  TESTIMONIALS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Loved by Developers Worldwide
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what app developers are saying about Feedly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      SJ
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">
                        Product Manager
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Feedly has transformed how we handle user feedback. We went
                    from spending hours reading reviews to getting instant
                    insights. Game changer!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      MC
                    </div>
                    <div>
                      <div className="font-semibold">Michael Chen</div>
                      <div className="text-sm text-muted-foreground">
                        Indie Developer
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The sentiment analysis is incredibly accurate. I can now
                    prioritize which issues to fix first based on real user
                    impact. Worth every penny!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      EP
                    </div>
                    <div>
                      <div className="font-semibold">Emily Parker</div>
                      <div className="text-sm text-muted-foreground">
                        CTO, TechStart
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The competitor analysis feature is brilliant. We can see
                    what users love about competing apps and improve our own.
                    Highly recommend!"
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50M+</div>
                <div className="text-sm text-muted-foreground">
                  Reviews Analyzed
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  4.9/5
                </div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                  <span className="text-xs font-medium text-primary">
                    CONTACT
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground">
                  Have questions about our platform or pricing? Reach out to us,
                  and we'll be happy to help.
                </p>
              </div>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="text-sm font-medium mb-2 block"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email_contact"
                          className="text-sm font-medium mb-2 block"
                        >
                          Email
                        </label>
                        <Input
                          id="email_contact"
                          type="email"
                          className="bg-background/50 border-border/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="text-sm font-medium mb-2 block"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="flex w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
