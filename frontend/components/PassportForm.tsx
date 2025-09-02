import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, FileImage } from "lucide-react";
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
    dateOfBirth: passport?.dateOfBirth ? new Date(passport.dateOfBirth).toISOString().split('T')[0] : "",
    issueDate: passport?.issueDate ? new Date(passport.issueDate).toISOString().split('T')[0] : "",
    expiryDate: passport?.expiryDate ? new Date(passport.expiryDate).toISOString().split('T')[0] : "",
    status: passport?.status || "not_applied" as PassportStatus,
    jobCategory: passport?.jobCategory || "",
    totalCharge: passport?.totalCharge?.toString() || "0",
    amountPaid: passport?.amountPaid?.toString() || "0",
    passportImageUrl: passport?.passportImageUrl || "",
    notes: passport?.notes || "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    passport?.passportImageUrl || null
  );

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, passportImageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.passportNumber.trim()) {
      toast({
        title: "Error",
        description: "Passport number is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dateOfBirth) {
      toast({
        title: "Error",
        description: "Date of birth is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.expiryDate) {
      toast({
        title: "Error",
        description: "Expiry date is required",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = formData.passportImageUrl;

    // In a real application, you would upload the image to a cloud service like AWS S3
    // For now, we'll use a data URL (not recommended for production)
    if (selectedImage) {
      imageUrl = imagePreview || "";
    }

    const totalCharge = parseFloat(formData.totalCharge) || 0;
    const amountPaid = parseFloat(formData.amountPaid) || 0;

    // Convert date strings to Date objects
    const dateOfBirth = new Date(formData.dateOfBirth + 'T00:00:00.000Z');
    const expiryDate = new Date(formData.expiryDate + 'T00:00:00.000Z');
    const issueDate = formData.issueDate ? new Date(formData.issueDate + 'T00:00:00.000Z') : undefined;

    // Validate dates
    if (isNaN(dateOfBirth.getTime())) {
      toast({
        title: "Error",
        description: "Invalid date of birth",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(expiryDate.getTime())) {
      toast({
        title: "Error",
        description: "Invalid expiry date",
        variant: "destructive",
      });
      return;
    }

    if (issueDate && isNaN(issueDate.getTime())) {
      toast({
        title: "Error",
        description: "Invalid issue date",
        variant: "destructive",
      });
      return;
    }

    const baseData = {
      name: formData.name.trim(),
      passportNumber: formData.passportNumber.trim(),
      dateOfBirth: dateOfBirth,
      issueDate: issueDate,
      expiryDate: expiryDate,
      status: formData.status,
      jobCategory: formData.jobCategory.trim() || undefined,
      totalCharge: totalCharge,
      amountPaid: amountPaid,
      passportImageUrl: imageUrl || undefined,
      notes: formData.notes.trim() || undefined,
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

  // Calculate amount due automatically
  const totalCharge = parseFloat(formData.totalCharge) || 0;
  const amountPaid = parseFloat(formData.amountPaid) || 0;
  const amountDue = totalCharge - amountPaid;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number *</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => handleChange("passportNumber", e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter passport number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Passport Status *</Label>
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
              <Label htmlFor="jobCategory">Job Category</Label>
              <Input
                id="jobCategory"
                value={formData.jobCategory}
                onChange={(e) => handleChange("jobCategory", e.target.value)}
                disabled={isLoading}
                placeholder="Enter job category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleChange("issueDate", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
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
              <Label htmlFor="totalCharge">Total Cost ($)</Label>
              <Input
                id="totalCharge"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalCharge}
                onChange={(e) => handleChange("totalCharge", e.target.value)}
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid ($)</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                max={totalCharge}
                value={formData.amountPaid}
                onChange={(e) => handleChange("amountPaid", e.target.value)}
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Amount Due ($)</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                ${amountDue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Passport Image</CardTitle>
            <CardDescription>
              Upload a clear image of the passport (JPG, PNG, WebP - Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Passport preview"
                    className="max-w-full h-64 object-contain border border-border rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No passport image uploaded
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                  id="passport-image"
                />
                <Label
                  htmlFor="passport-image"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            disabled={isLoading}
            placeholder="Add any additional notes or comments here..."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Passport" : "Create Passport"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
