import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-12 text-center max-w-md">
          <h1 className="text-5xl font-bold text-primary mb-2">404</h1>
          <p className="text-xl font-semibold text-foreground mb-2">
            Page not found
          </p>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist. It might have been moved or
            deleted.
          </p>
          <Link to="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotFound;
