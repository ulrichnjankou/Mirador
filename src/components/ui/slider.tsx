import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-200">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600" />
    </SliderPrimitive.Track>
    {/* Render multiple thumbs based on the value array length */}
    {Array.isArray(props.value) ? (
      props.value.map((_, index) => (
        <SliderPrimitive.Thumb 
          key={index}
          className="block h-4 w-4 rounded-full border-2 border-blue-600 bg-blue-600 shadow-md ring-offset-background transition-all hover:scale-125 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer" 
        />
      ))
    ) : (
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-blue-600 bg-blue-600 shadow-md ring-offset-background transition-all hover:scale-125 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer" />
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };