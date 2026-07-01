import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm",
    secondary: "bg-white text-[#374151] border border-[#D1D5DB] hover:bg-[#F3F4F6] shadow-sm",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm",
    ghost: "hover:bg-[#F3F4F6] text-[#374151]",
  }
  
  const sizes = {
    default: "h-[44px] px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-[44px] w-[44px]",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
