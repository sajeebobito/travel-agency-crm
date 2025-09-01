import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { Passport, PassportStatus, CreatePassportRequest, UpdatePassportRequest } from "~backend/passport/types";

interface PassportFormProps {
  passport?: Passport | null;
  onSaved: () => void;
  onCancel: () => void;
}

const statusOptions: { value: PassportStatus; label: string }[] = [
  { value: "not_applied", label: "Not Applied" },
  { value: "pending", label: "Pending" },
  { value: "valid", label: "Valid" },
  { value: "rejected", label: "Rejected" },
  { value: "canceled", label: "Canceled" },
  { value: "flight_complete", label: "Flight Complete" },
];

export function PassportForm({ passport, onSaved, onCancel }: PassportFormProps) {
  const { toast } = useToast();
  const isEditing = !!passport;

  const [formData, setFormData] = useState({
    name: passport?.name || "",
    passportNumber: passport?.passportNumber || "",
    nationality: passport?.nationality || "",
    dateOfBirth: passport?.dateOfBirth ? new Date(passport.dateOfBirth).toISOString().split('T')[0] : "",
    expiryDate: passport?.expiryDate ? new Date(passport.expiryDate).toISOString().split('T')[0] : "",
    status: passport?.status || "not_applied" as PassportStatus,
    applicationDate: passport?.applicationDate ? new Date(passport.applicationDate).toISOString().split('T')[0] : "",
    approvalDate: passport?.approvalDate ? new Date(passport.approvalDate).toISOString().split('T')[0] : "",
    notes: passport?.notes || "",
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePassportRequest) => backend.passport.create(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Passport created successfully",
      });
      onSaved();
    },
    onError: (error: any) => {
      console.error("Error creating passport:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create passport",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePassportRequest) => backend.passport.update(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Passport updated successfully",
      });
      onSaved();
    },
    onError: (error: any) => {
      console.error("Error updating passport:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update passport",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      name: formData.name,
      passportNumber: formData.passportNumber,
      nationality: formData.nationality,
      dateOfBirth: new Date(formData.dateOfBirth),
      expiryDate: new Date(formData.expiryDate),
      status: formData.status,
      applicationDate: formData.applicationDate ? new Date(formData.applicationDate) : undefined,
      approvalDate: formData.approvalDate ? new Date(formData.approvalDate) : undefined,
      notes: formData.notes || undefined,
    };

    if (isEditing && passport) {
      updateMutation.mutate({
        id: passport.id,
        ...baseData,
      });
    } else {
      createMutation.mutate(baseData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number</Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => handleChange("passportNumber", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: PassportStatus) => handleChange("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDate">Application Date</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={(e) => handleChange("applicationDate", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalDate">Approval Date</Label>
          <Input
            id="approvalDate"
            type="date"
            value={formData.approvalDate}
            onChange={(e) => handleChange("approvalDate", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Passport" : "Create Passport"}
        </Button>
      </div>
    </form>
  );
}
