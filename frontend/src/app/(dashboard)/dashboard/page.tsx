"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { appService, DashboardStats } from "@/services/appService";
import { Smartphone, MessageSquare, Star, Heart } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await appService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="space-y-6 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <Smartphone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_apps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Avis</CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_reviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.average_rating} ★</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiments</CardTitle>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs items-end h-8">
              <div
                className="bg-green-500 rounded px-1 text-white"
                style={{
                  height: `${stats.sentiment_distribution.positive_pct}%`,
                  minHeight: "20%",
                }}
              >
                {stats.sentiment_distribution.positive_pct}%
              </div>
              <div
                className="bg-yellow-500 rounded px-1 text-white"
                style={{
                  height: `${stats.sentiment_distribution.neutral_pct}%`,
                  minHeight: "20%",
                }}
              >
                {stats.sentiment_distribution.neutral_pct}%
              </div>
              <div
                className="bg-red-500 rounded px-1 text-white"
                style={{
                  height: `${stats.sentiment_distribution.negative_pct}%`,
                  minHeight: "20%",
                }}
              >
                {stats.sentiment_distribution.negative_pct}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0"
                  >
                    {activity.app_icon ? (
                      <img
                        src={activity.app_icon}
                        alt=""
                        className="size-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {activity.app_name.substring(0, 1)}
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {activity.app_name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${
                                i < activity.rating
                                  ? "fill-current"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        {activity.sentiment !== null && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              activity.sentiment > 0.3
                                ? "bg-green-100 text-green-700"
                                : activity.sentiment < -0.3
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {activity.sentiment > 0.3
                              ? "Positif"
                              : activity.sentiment < -0.3
                              ? "Négatif"
                              : "Neutre"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {activity.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucune activité récente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Astuce</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary/80">
                Connectez le Chatbot pour analyser en profondeur les tendances
                de vos avis !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
