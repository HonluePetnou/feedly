"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ReviewChart } from "@/components/charts/ReviewChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">4.3 ★</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Positive Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-500">
            68%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Neutral Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-500">
            22%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Negative Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-500">
            10%
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewChart type="pie" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewChart type="line" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bug Category Histogram</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewChart type="bar" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
