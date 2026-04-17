import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-9 h-9", text: "text-lg", pulse: "w-2.5 h-2.5" },
    md: { icon: "w-11 h-11", text: "text-xl", pulse: "w-3 h-3" },
    lg: { icon: "w-14 h-14", text: "text-2xl", pulse: "w-4 h-4" },
    xl: { icon: "w-20 h-20", text: "text-4xl", pulse: "w-6 h-6" },
  };

  const { icon, text, pulse } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative", icon)}>
        {/* Gradient outer */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-primary shadow-soft" />
        {/* Inner */}
        <div className="absolute inset-[2px] rounded-[14px] bg-card flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 40 40" className="w-[78%] h-[78%]" fill="none">
            <path
              d="M4 20 L11 20 L13.5 13 L17 27 L20.5 11 L24 28 L26.5 20 L36 20"
              stroke="hsl(var(--primary))"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* Pulse dot */}
        <span className={cn("absolute -top-0.5 -right-0.5 rounded-full bg-gradient-primary", pulse)}>
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
        </span>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight", text)}>
            <span className="text-gradient-primary">Pulse</span>
            <span className="text-foreground">Point</span>
          </span>
          {size !== "sm" && (
            <span className="text-[10px] text-muted-foreground tracking-[0.18em] uppercase mt-1">
              Healthcare Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
