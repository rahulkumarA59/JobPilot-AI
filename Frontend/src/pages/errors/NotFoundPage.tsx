import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-primary select-none opacity-20">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sorry, we couldn't find the page you are looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="gradient" className="gap-2">
              <Home className="h-4 w-4" /> Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
