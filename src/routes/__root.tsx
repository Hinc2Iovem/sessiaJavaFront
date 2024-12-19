import DivBgColor from "@/components/shared/DivBgColor";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <DivBgColor bgColor="bg-primary" />
      <div className="p-[1rem] max-w-[148rem] mx-auto">
        <Outlet />
      </div>
      <Toaster />
    </>
  ),
});
