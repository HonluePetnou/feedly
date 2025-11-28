"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Plus, Play, Activity } from "lucide-react";
import Link from "next/link";

const mockApps = [
  {
    id: "1",
    name: "Feedly Mobile",
    icon: "FM",
    lastAnalysis: "2 hours ago",
    score: 4.5,
    status: "active",
  },
  {
    id: "2",
    name: "Feedly Pro",
    icon: "FP",
    lastAnalysis: "1 day ago",
    score: 4.2,
    status: "active",
  },
];

export default function AppsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Monitored Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze your applications.
          </p>
        </div>
        <Link href="/apps/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            Add Application
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockApps.map((app) => (
          <Card
            key={app.id}
            className="group hover:shadow-lg transition-all duration-300 border-primary/10"
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {app.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{app.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Last analysis: {app.lastAnalysis}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-medium">
                <Activity className="size-3" />
                {app.score}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Status</span>
                <span className="capitalize text-foreground">{app.status}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                <Play className="size-4" />
                Analyze Now
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Card Placeholder */}
        <Link href="/apps/new" className="block h-full">
          <Card className="h-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 cursor-pointer text-muted-foreground hover:text-primary">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="size-8" />
            </div>
            <p className="font-medium">Add New Application</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
