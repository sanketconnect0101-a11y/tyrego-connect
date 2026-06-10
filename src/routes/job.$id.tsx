import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/job/$id")({ component: () => <Outlet /> });
