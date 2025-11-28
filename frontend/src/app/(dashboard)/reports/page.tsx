"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import {
  Download,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const mockTickets = [
  {
    id: "JIRA-101",
    title: "Login crash on Android 14",
    severity: "Critical",
    status: "Open",
    assignee: "Dev Team",
    date: "2024-03-10",
  },
  {
    id: "JIRA-102",
    title: "Dark mode toggle bug",
    severity: "Medium",
    status: "In Progress",
    assignee: "Sarah J.",
    date: "2024-03-09",
  },
  {
    id: "JIRA-103",
    title: "Update privacy policy link",
    severity: "Low",
    status: "Done",
    assignee: "Mike T.",
    date: "2024-03-08",
  },
  {
    id: "JIRA-104",
    title: "Slow loading on profile",
    severity: "High",
    status: "Open",
    assignee: "Dev Team",
    date: "2024-03-07",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Tickets</h1>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Bugs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved this week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">8</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="size-5" />
            Jira Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.severity === "Critical"
                          ? "destructive"
                          : ticket.severity === "High"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {ticket.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ticket.status === "Done" ? (
                        <CheckCircle2 className="size-4 text-green-500" />
                      ) : ticket.status === "In Progress" ? (
                        <Clock className="size-4 text-blue-500" />
                      ) : (
                        <AlertTriangle className="size-4 text-muted-foreground" />
                      )}
                      {ticket.status}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
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
