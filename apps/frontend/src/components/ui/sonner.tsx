"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = "system" } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className={`toaster group ${resolvedTheme === "tavern" ? "tavern-theme" : ""}`}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-hearth)] group-[.toaster]:text-[var(--color-parchment)] group-[.toaster]:border-[var(--color-smoke)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[var(--color-ghost)]",
          actionButton:
            "group-[.toast]:bg-[var(--color-ale)] group-[.toast]:text-black",
          cancelButton:
            "group-[.toast]:bg-[var(--color-cask)] group-[.toast]:text-[var(--color-ghost)]",
        },
      }}
      icons={{
        success: <CheckCircle className="h-4 w-4 text-[var(--color-moss)]" />,
        info: <Info className="h-4 w-4 text-[var(--color-moonlight)]" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        error: <XCircle className="h-4 w-4 text-[var(--color-ember)]" />,
        loading: <Loader className="h-4 w-4 text-gray-400 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
