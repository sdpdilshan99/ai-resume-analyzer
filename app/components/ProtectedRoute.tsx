// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "~/lib/auth-store";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth, but remember where they wanted to go
    return <Navigate to={`/auth?next=${location.pathname}`} replace />;
  }

  return <Outlet />;
};