import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PassportsList } from "./PassportsList";
import { PassportForm } from "./PassportForm";
import { PassportStats } from "./PassportStats";
import { SearchAndFilter } from "./SearchAndFilter";
import { ThemeToggle } from "./ThemeToggle";
import backend from "~backend/client";
import type { Passport, ListPassportsRequest } from "~backend/passport/types";

export function PassportDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPassport, setEditingPassport] = useState<Passport | null>(null);
  const [filters, setFilters] = useState<ListPassportsRequest>({
    limit: 50,
    offset: 0,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: passportsData, refetch: refetchPassports } = useQuery({
    queryKey: ["passports", filters],
    queryFn: () => backend.passport.list(filters),
  });

  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["passport-stats"],
    queryFn: () => backend.passport.stats(),
  });

  const handlePassportSaved = () => {
    refetchPassports();
    refetchStats();
    setEditingPassport(null);
    setActiveTab("passports");
  };

  const handlePassportDeleted = () => {
    refetchPassports();
    refetchStats();
  };

  const handleEditPassport = (passport: Passport) => {
    setEditingPassport(passport);
    setActiveTab("add");
  };

  const handleAddNew = () => {
    setEditingPassport(null);
    setActiveTab("add");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SH TRAVEL AGENCY DATA SERVER</h1>
        </div>
        <ThemeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="passports">Passports</TabsTrigger>
          <TabsTrigger value="add">
            {editingPassport ? "Edit Passport" : "Add Passport"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Not Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {statsData?.stats.not_applied || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {statsData?.stats.pending || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statsData?.stats.valid || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statsData?.stats.rejected || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Canceled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {statsData?.stats.canceled || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flight Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statsData?.stats.flight_complete || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Passports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {statsData?.total || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <PassportStats data={statsData} />
        </TabsContent>

        <TabsContent value="passports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Passports</CardTitle>
              <CardDescription>
                Manage your passport records with search, filter, and sort capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchAndFilter
                filters={filters}
                onFiltersChange={setFilters}
                onAddNew={handleAddNew}
              />
              <PassportsList
                data={passportsData}
                onEdit={handleEditPassport}
                onDelete={handlePassportDeleted}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPassport ? "Edit Passport" : "Add New Passport"}
              </CardTitle>
              <CardDescription>
                {editingPassport
                  ? "Update the passport information below"
                  : "Enter the passport details to add a new record"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PassportForm
                passport={editingPassport}
                onSaved={handlePassportSaved}
                onCancel={() => {
                  setEditingPassport(null);
                  setActiveTab("passports");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
