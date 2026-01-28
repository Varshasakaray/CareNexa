import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      autoPlay = true,
      interval = 4000,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef(null);
    const [index, setIndex] = React.useState(0);
    const [length, setLength] = React.useState(0);

    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const slides = el.querySelectorAll("[data-carousel-item]");
      setLength(slides.length);
    }, [children]);

    const canScrollPrev = index > 0;
    const canScrollNext = index < length - 1;

    const scrollPrev = React.useCallback(() => {
      setIndex((i) => (i > 0 ? i - 1 : i));
    }, []);

    const scrollNext = React.useCallback(() => {
      setIndex((i) => (i < length - 1 ? i + 1 : i));
    }, [length]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!autoPlay || length <= 1) return;
      const id = setInterval(() => {
        setIndex((i) => (i + 1) % length);
      }, interval);
      return () => clearInterval(id);
    }, [autoPlay, interval, length]);

    return (
      <CarouselContext.Provider
        value={{
          containerRef,
          index,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          setIndex,
          length,
        }}
      >
        <div
          ref={ref}
          onKeyDown={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { containerRef, index, orientation } = useCarousel();
  const isHorizontal = orientation === "horizontal";
  const transform = isHorizontal
    ? `translateX(-${index * 100}%)`
    : `translateY(-${index * 100}%)`;

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex transition-transform duration-500 ease-in-out",
          isHorizontal ? "" : "flex-col",
          className,
        )}
        style={{ transform }}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  const isHorizontal = orientation === "horizontal";
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      data-carousel-item
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        isHorizontal ? "" : "basis-auto",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "left-4 top-1/2 -translate-y-1/2"
            : "top-4 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "right-4 top-1/2 -translate-y-1/2"
            : "bottom-4 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
