import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, Eye } from "lucide-react";
import backend from "~backend/client";
import type { Passport, ListPassportsResponse, PassportStatus } from "~backend/passport/types";

interface PassportsListProps {
  data?: ListPassportsResponse;
  onEdit: (passport: Passport) => void;
  onDelete: () => void;
}

const statusColors: Record<PassportStatus, string> = {
  not_applied: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  valid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  canceled: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  flight_complete: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const statusLabels: Record<PassportStatus, string> = {
  not_applied: "Not Applied",
  pending: "Pending",
  valid: "Valid",
  rejected: "Rejected",
  canceled: "Canceled",
  flight_complete: "Flight Complete",
};

export function PassportsList({ data, onEdit, onDelete }: PassportsListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.passport.deletePassport({ id }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Passport deleted successfully",
      });
      onDelete();
    },
    onError: (error: any) => {
      console.error("Error deleting passport:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete passport",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const passports = data?.passports || [];

  if (passports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No passports found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Passport Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Job Category</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passports.map((passport) => (
            <TableRow key={passport.id}>
              <TableCell className="font-medium">{passport.name}</TableCell>
              <TableCell className="font-mono text-sm">{passport.passportNumber}</TableCell>
              <TableCell>
                <Badge className={statusColors[passport.status]}>
                  {statusLabels[passport.status]}
                </Badge>
              </TableCell>
              <TableCell>{passport.jobCategory || "-"}</TableCell>
              <TableCell>
                {passport.issueDate ? formatDate(passport.issueDate) : "-"}
              </TableCell>
              <TableCell>{formatDate(passport.expiryDate)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(passport.totalCharge)}
              </TableCell>
              <TableCell className="font-medium text-green-600">
                {formatCurrency(passport.amountPaid)}
              </TableCell>
              <TableCell className="font-medium text-red-600">
                {formatCurrency(passport.amountDue)}
              </TableCell>
              <TableCell>
                {passport.passportImageUrl ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Passport Image - {passport.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img
                          src={passport.passportImageUrl}
                          alt={`Passport for ${passport.name}`}
                          className="max-w-full max-h-96 object-contain rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-muted-foreground text-sm">No image</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(passport)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          passport record for {passport.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(passport.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
