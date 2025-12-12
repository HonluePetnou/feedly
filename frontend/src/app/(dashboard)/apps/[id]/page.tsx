"use client";

import { useEffect, useState, use } from "react";
import {
  appService,
  AppDetail,
  AppAnalytics,
  Review,
} from "@/services/appService";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  RefreshCw,
  Trash2,
  Calendar,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditAppDialog } from "@/components/dashboard/EditAppDialog";

export default function AppDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [analytics, setAnalytics] = useState<AppAnalytics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const appId = parseInt(id);

  useEffect(() => {
    loadData();
  }, [appId]);

  const loadData = async () => {
    try {
      const [appData, analyticsData, reviewsData] = await Promise.all([
        appService.getApp(appId),
        appService.getAnalytics(appId),
        appService.getReviews(appId, 10),
      ]);
      setApp(appData);
      setAnalytics(analyticsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load app data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!app) return;
    setSyncing(true);
    try {
      await appService.addApp(app.package_name);
      await loadData();
    } catch (error) {
      console.error("Failed to sync app:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cette application et tous ses avis ?")) return;
    try {
      await appService.deleteApp(appId);
      router.push("/apps");
    } catch (error) {
      console.error("Failed to delete app:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Chargement...</div>
    );
  }

  if (!app || !analytics) {
    return <div>Application non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/apps">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {app.icon_url ? (
              <img
                src={app.icon_url}
                alt=""
                className="size-16 rounded-xl object-cover"
              />
            ) : (
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {app.name?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{app.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Package className="size-3" /> {app.package_name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditAppDialog
            app={{ id: app.id, name: app.name, icon_url: app.icon_url }}
            onUpdate={loadData}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw
              className={`size-4 mr-2 ${syncing ? "animate-spin" : ""}`}
            />
            Sync
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="size-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Analytics Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.average_rating
                ? analytics.average_rating.toFixed(1)
                : "N/A"}
              /5
            </div>
            <p className="text-xs text-muted-foreground">
              Basé sur {app.nb_reviews} avis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sentiments Positifs
            </CardTitle>
            <div className="size-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.sentiments.positive}
            </div>
            <p className="text-xs text-muted-foreground">Avis positifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problèmes / Négatifs
            </CardTitle>
            <div className="size-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.sentiments.negative}
            </div>
            <p className="text-xs text-muted-foreground">Avis négatifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Meta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Créé le</span>
                <span>{new Date(app.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Dernier scrape</span>
                <span>
                  {app.last_scraped
                    ? new Date(app.last_scraped).toLocaleString()
                    : "Jamais"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Avis</span>
                <span>{app.nb_reviews}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Derniers Avis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="size-3 fill-current" />
                      <span className="text-sm font-medium">
                        {review.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-3">
                    {review.content}
                  </p>
                  {review.sentiment !== null && (
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          review.sentiment > 0.3
                            ? "bg-green-500"
                            : review.sentiment < -0.3
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {review.sentiment > 0.3
                          ? "Positif"
                          : review.sentiment < -0.3
                          ? "Négatif"
                          : "Neutre"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun avis récent
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
