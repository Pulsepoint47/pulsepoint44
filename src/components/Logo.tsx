import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", pulse: "w-3 h-3" },
    md: { icon: "w-10 h-10", text: "text-xl", pulse: "w-4 h-4" },
    lg: { icon: "w-14 h-14", text: "text-2xl", pulse: "w-5 h-5" },
    xl: { icon: "w-20 h-20", text: "text-4xl", pulse: "w-7 h-7" },
  };

  const { icon, text, pulse } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon - Pulse/Heartbeat inspired */}
      <div className={cn("relative", icon)}>
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 shadow-lg shadow-teal-500/30" />
        
        {/* Inner design */}
        <div className="absolute inset-[3px] rounded-lg bg-white flex items-center justify-center overflow-hidden">
          {/* Heartbeat line */}
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background pulse circle */}
            <circle
              cx="20"
              cy="20"
              r="14"
              className="fill-teal-50"
            />
            
            {/* ECG/Heartbeat line */}
            <path
              d="M6 20 L12 20 L14 14 L17 26 L20 12 L23 28 L26 20 L34 20"
              className="stroke-teal-500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* Center dot - the pulse point */}
            <circle
              cx="20"
              cy="20"
              r="3"
              className="fill-gradient-to-br from-teal-500 to-cyan-500"
              fill="url(#pulseGradient)"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Animated pulse effect */}
        <div className={cn(
          "absolute -top-1 -right-1 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500",
          pulse
        )}>
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight leading-none", text)}>
            <span className="text-teal-600">Pulse</span>
            <span className="text-slate-700">Point</span>
          </span>
          {size !== "sm" && (
            <span className="text-[10px] text-slate-500 tracking-wider uppercase">
              Healthcare Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
