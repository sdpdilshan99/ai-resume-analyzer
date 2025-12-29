import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth", "routes/auth.tsx"),
    layout("components/ProtectedRoute.tsx", [
        route("upload", "routes/upload.tsx"),
    ]),
    route("results/:id", "routes/results.tsx")

] satisfies RouteConfig;
