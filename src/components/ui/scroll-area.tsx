import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    hideScrollToTop?: boolean; // Add this optional prop
  }
>(({ className, children, hideScrollToTop = false, ...props }, ref) => {
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    if (!hideScrollToTop) {
      setShowBackToTop(scrollTop > 100);
    }
  };

  const scrollToTop = () => {
    innerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollAreaPrimitive.Root
      ref={innerRef}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit]"
        onScroll={handleScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />

      {!hideScrollToTop && showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-16 z-10 p-2 rounded-full bg-primary text-white"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </ScrollAreaPrimitive.Root>
  );
});


ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-primary" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
