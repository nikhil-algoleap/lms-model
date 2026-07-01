import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, hasError, hasSuccess, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[8px] border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#111827] shadow-sm transition-all placeholder:text-[#9CA3AF]",
        "hover:border-[#9CA3AF]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]",
        "disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#6B7280]",
        "read-only:bg-[#F9FAFB] read-only:text-[#6B7280] read-only:focus-visible:ring-0 read-only:focus-visible:border-[#D1D5DB]",
        hasError && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 focus-visible:shadow-[0_0_0_2px_rgba(239,68,68,0.2)] hover:border-red-500",
        hasSuccess && "border-emerald-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] hover:border-emerald-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
