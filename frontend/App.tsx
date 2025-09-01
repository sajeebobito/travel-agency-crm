import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { PassportDashboard } from "./components/PassportDashboard";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <PassportDashboard />
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
