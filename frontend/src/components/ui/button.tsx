import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles: Record<string, string> = {
      default: "bg-sky-600 text-white hover:bg-sky-700/90",
      destructive: "bg-red-600 text-white hover:bg-red-700/90",
      outline:
        "border border-sky-300 bg-transparent hover:bg-sky-100 hover:text-sky-700",
      secondary: "bg-sky-100 text-sky-700 hover:bg-sky-200/80",
      ghost: "hover:bg-sky-100 hover:text-sky-700",
      link: "text-sky-600 underline-offset-4 hover:underline",
    };

    const sizeStyles: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant!],
          sizeStyles[size!],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
