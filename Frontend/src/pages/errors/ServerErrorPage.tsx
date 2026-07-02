import { Link } from "react-router-dom";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-destructive select-none opacity-20">500</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Server Error</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Oops! Something went wrong on our end. Please try refreshing the page or try again later.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="gradient" className="gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" /> Refresh Page
          </Button>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
