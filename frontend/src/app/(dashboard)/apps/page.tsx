"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { appService, App } from "@/services/appService";

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await appService.getApps();
      setApps(data);
    } catch (error) {
      console.error("Failed to load apps:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApp = async (id: number) => {
    if (!confirm("Supprimer cette application et tous ses avis ?")) return;

    try {
      await appService.deleteApp(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete app:", error);
    }
  };

  const syncApp = async (app: App) => {
    setSyncing(app.id);
    try {
      await appService.addApp(app.package_name);
      await loadApps();
    } catch (error) {
      console.error("Failed to sync app:", error);
    } finally {
      setSyncing(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Applications surveillées
          </h1>
          <p className="text-muted-foreground">
            Gérez et analysez vos applications.
          </p>
        </div>
        <Link href="/apps/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            Ajouter une app
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="relative group">
            <Link href={`/apps/${app.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/10 cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  {app.icon_url ? (
                    <img
                      src={app.icon_url}
                      alt={app.name || ""}
                      className="size-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {(app.name || app.package_name)
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {app.name || app.package_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {app.package_name}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Dernière synchro</span>
                    <span className="text-foreground">
                      {formatDate(app.last_scraped)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 gap-2">
                  <div className="flex w-full gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        syncApp(app);
                      }}
                      disabled={syncing === app.id}
                    >
                      <RefreshCw
                        className={`size-4 ${
                          syncing === app.id ? "animate-spin" : ""
                        }`}
                      />
                      Sync
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteApp(app.id);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}

        {/* Add New Card Placeholder */}
        <Link href="/apps/new" className="block h-full">
          <Card className="h-full min-h-[200px] border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 cursor-pointer text-muted-foreground hover:text-primary">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="size-8" />
            </div>
            <p className="font-medium">Ajouter une application</p>
          </Card>
        </Link>
      </div>

      {apps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Aucune application surveillée pour le moment.
          </p>
          <Link href="/apps/new">
            <Button>
              <Plus className="size-4 mr-2" />
              Ajouter votre première app
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
