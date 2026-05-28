import logoFullWhite from "@/assets/logo-full-white.svg";
import logoFullBlack from "@/assets/logo-full-black.svg";
import logoMarkWhite from "@/assets/logo-mark-white.svg";
import logoMarkBlack from "@/assets/logo-mark-black.svg";
import { useTheme } from "@/providers/AppProviders";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ variant = "full", className }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const src =
    variant === "full"
      ? isDark
        ? logoFullWhite
        : logoFullBlack
      : isDark
        ? logoMarkWhite
        : logoMarkBlack;
  return <img src={src} alt="OUZESOF" className={className} />;
}
