import type { LucideIcon as LucideIconType } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface SidebarNavLinkProps {
  icon: LucideIconType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  isCollapsed?: boolean;
}

export function SidebarNavLink({
  icon: Icon,
  label,
  onClick,
  to,
  isCollapsed = false,
}: SidebarNavLinkProps) {
  const content = (
    <>
      <Icon className={cn("w-5 h-5 shrink-0 text-white")} />
      <span
        className={cn(
          "font-medium transition-opacity duration-300 whitespace-nowrap text-white",
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}
      >
        {label}
      </span>
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg transition-colors w-full text-left cursor-pointer text-white",
    isCollapsed ? "px-3 py-3 justify-center gap-0" : "px-4 py-3"
  );

  // If it's a button (onClick without to)
  if (onClick && !to) {
    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, "hover:bg-white/10")}
      >
        {content}
      </button>
    );
  }

  // If it's a link
  return (
    <NavLink
      to={to || "#"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(baseClasses, isActive ? "bg-white/20" : "hover:bg-white/10")
      }
    >
      {content}
    </NavLink>
  );
}
