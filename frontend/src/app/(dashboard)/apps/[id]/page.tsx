"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ReviewChart } from "@/components/charts/ReviewChart";
import {
  Download,
  Filter,
  Search,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useParams } from "next/navigation";

const mockReviews = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    date: "2024-03-10",
    content: "Great app! Very useful features.",
    sentiment: "positive",
    category: "Feature",
  },
  {
    id: 2,
    user: "Jane Smith",
    rating: 2,
    date: "2024-03-09",
    content: "Crashing on startup after update.",
    sentiment: "negative",
    category: "Bug",
  },
  {
    id: 3,
    user: "Bob Johnson",
    rating: 3,
    date: "2024-03-08",
    content: "It's okay, but needs dark mode.",
    sentiment: "neutral",
    category: "UI/UX",
  },
  {
    id: 4,
    user: "Alice Brown",
    rating: 1,
    date: "2024-03-07",
    content: "Cannot login at all. Fix this!",
    sentiment: "negative",
    category: "Bug",
  },
  {
    id: 5,
    user: "Charlie Wilson",
    rating: 5,
    date: "2024-03-06",
    content: "Love the new interface.",
    sentiment: "positive",
    category: "UI/UX",
  },
];

export default function DetailedAnalysisPage() {
  const params = useParams();
  const appId = params.id;

  return (
    <div className="space-y-6">
      {/* App Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            FM
          </div>
          <div>
            <h1 className="text-2xl font-bold">Feedly Mobile</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Version 2.4.0</span>
              <span>•</span>
              <span>Last analyzed: 2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Filter className="size-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              4.5 <Star className="size-5 fill-yellow-500 text-yellow-500" />
            </div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <CheckCircle className="size-3 mr-1" /> +0.2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">
              Since last update
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive flex items-center gap-2">
              12 <AlertCircle className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewChart type="line" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issue Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewChart type="bar" />
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reviews..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[40%]">Review</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="whitespace-nowrap">
                    {review.date}
                  </TableCell>
                  <TableCell>{review.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {review.rating}{" "}
                      <Star className="size-3 ml-1 fill-yellow-500 text-yellow-500" />
                    </div>
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[300px]"
                    title={review.content}
                  >
                    {review.content}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.sentiment === "positive"
                          ? "success"
                          : review.sentiment === "negative"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {review.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{review.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
