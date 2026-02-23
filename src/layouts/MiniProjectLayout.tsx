import { Outlet } from "react-router-dom";
import { BackToHome } from "@/components/ui/backToHome";

export function MiniProjectLayout() {
  return (
    <div className="relative">
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
        <BackToHome />
      </div>
      <Outlet />
    </div>
  );
}
