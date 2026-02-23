import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function BackToHome() {
  return (
    <Link
      to="/"
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#35d4ba66] bg-[#35d4ba22] px-3 text-sm font-medium text-[#b7fff1] transition-colors hover:bg-[#35d4ba33]"
    >
      <ArrowLeft className="h-4 w-4" />
      Home
    </Link>
  );
}
