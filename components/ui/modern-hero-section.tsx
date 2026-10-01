import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface HeroCollageImage {
  src: string;
  alt: string;
  // The picture's own size in pixels: its proportions set the shape of its spot in the collage
  width: number;
  height: number;
}

// Define the props for the component
interface HeroCollageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  // Up to seven images: the first sits in the middle, the rest around it
  images: HeroCollageImage[];
}

// Keyframes for the floating animation
const animationStyle = `
  @keyframes float-up {
    0% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    50% { transform: translateY(-15px); box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
    100% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  }
  .animate-float-up {
    animation: float-up 6s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-float-up { animation: none; }
  }
`;

// The collage is laid out on a 1152 × 600 canvas that scales as one piece
const CANVAS_WIDTH = 1152;

// Where each image sits. Widths are a share of the canvas, so the arrangement keeps its proportions on
// every screen; the two outermost images only appear once there is room for them.
const SPOTS = [
  // Central
  { width: 26, className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl z-20', delay: '0s' },
  // Top-left
  { width: 18, className: 'left-[22%] top-[15%] z-10', delay: '-1.2s' },
  // Top-right
  { width: 16.5, className: 'right-[24%] top-[10%] z-10', delay: '-2.5s' },
  // Bottom-right
  { width: 21, className: 'right-[20%] bottom-[12%] z-30', delay: '-3.5s' },
  // Far-right
  { width: 18, className: 'right-[5%] top-1/2 -translate-y-[60%] z-10 hidden md:block', delay: '-4.8s' },
  // Bottom-left
  { width: 19.5, className: 'left-[18%] bottom-[8%] z-30', delay: '-5.2s' },
  // Far-left
  { width: 16.5, className: 'left-[5%] top-[25%] z-10 hidden md:block', delay: '-6s' },
];

// Below the md breakpoint the canvas is drawn one and a half times the screen's width (the w-[150%] below),
// with its sides cropped, so the images stay a readable size
const SMALL_SCREEN_SCALE = 1.5;

const HeroCollage = React.forwardRef<HTMLElement, HeroCollageProps>(
  ({ className, title, subtitle, stats, images, ...props }, ref) => {
    const displayImages = images.slice(0, SPOTS.length);

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: animationStyle }} />
        <section
          ref={ref}
          className={cn(
            'relative w-full bg-background font-sans py-20 sm:py-32 overflow-hidden',
            className
          )}
          {...props}
        >
          {/* Main Content */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Image Collage */}
          <div className="relative z-0 mt-12 md:mt-20">
            <div className="relative left-1/2 aspect-[1152/600] w-[150%] max-w-6xl -translate-x-1/2 md:w-full">
              {displayImages.map((image, index) => {
                const spot = SPOTS[index];
                return (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes={`(min-width: ${CANVAS_WIDTH}px) ${Math.round((spot.width / 100) * CANVAS_WIDTH)}px, (min-width: 768px) ${spot.width}vw, ${spot.width * SMALL_SCREEN_SCALE}vw`}
                    // The central image is the largest thing on the first screen: fetch it straight away
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={cn('absolute h-auto rounded-xl shadow-lg animate-float-up', spot.className)}
                    style={{ width: `${spot.width}%`, animationDelay: spot.delay }}
                  />
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="container relative z-10 mx-auto mt-16 px-4">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-purple-500">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

HeroCollage.displayName = 'HeroCollage';

export { HeroCollage };
