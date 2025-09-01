import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, SortAsc, SortDesc } from "lucide-react";
import type { ListPassportsRequest, PassportStatus } from "~backend/passport/types";

interface SearchAndFilterProps {
  filters: ListPassportsRequest;
  onFiltersChange: (filters: ListPassportsRequest) => void;
  onAddNew: () => void;
}

const statusOptions: { value: PassportStatus; label: string }[] = [
  { value: "not_applied", label: "Not Applied" },
  { value: "pending", label: "Pending" },
  { value: "valid", label: "Valid" },
  { value: "rejected", label: "Rejected" },
  { value: "canceled", label: "Canceled" },
  { value: "flight_complete", label: "Flight Complete" },
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "date", label: "Date Created" },
  { value: "status", label: "Status" },
];

export function SearchAndFilter({ filters, onFiltersChange, onAddNew }: SearchAndFilterProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      search: searchValue || undefined,
      offset: 0,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFiltersChange({
      ...filters,
      search: undefined,
      offset: 0,
    });
  };

  const handleStatusFilter = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? undefined : (status as PassportStatus),
      offset: 0,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "name" | "date" | "status",
      offset: 0,
    });
  };

  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      offset: 0,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or passport number..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="secondary">
          Search
        </Button>
        {filters.search && (
          <Button onClick={handleClearSearch} variant="outline">
            Clear
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy || "name"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          title={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
        >
          {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>

        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  );
}
