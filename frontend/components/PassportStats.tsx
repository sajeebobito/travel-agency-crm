import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, Clock, CheckCircle, XCircle, Ban, Plane } from "lucide-react";
import type { PassportStatsResponse } from "~backend/passport/types";

interface PassportStatsProps {
  data?: PassportStatsResponse;
}

export function PassportStats({ data }: PassportStatsProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Passport Statistics</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { stats, total } = data;

  const getPercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const statItems = [
    {
      label: "Not Applied",
      count: stats.not_applied,
      percentage: getPercentage(stats.not_applied),
      icon: FileCheck,
      color: "bg-gray-500",
    },
    {
      label: "Pending",
      count: stats.pending,
      percentage: getPercentage(stats.pending),
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Valid",
      count: stats.valid,
      percentage: getPercentage(stats.valid),
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Rejected",
      count: stats.rejected,
      percentage: getPercentage(stats.rejected),
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      label: "Canceled",
      count: stats.canceled,
      percentage: getPercentage(stats.canceled),
      icon: Ban,
      color: "bg-orange-500",
    },
    {
      label: "Flight Complete",
      count: stats.flight_complete,
      percentage: getPercentage(stats.flight_complete),
      icon: Plane,
      color: "bg-blue-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passport Statistics</CardTitle>
        <CardDescription>
          Overview of passport statuses and their distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No passport data available yet.</p>
            <p className="text-sm text-muted-foreground">Add your first passport to see statistics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
