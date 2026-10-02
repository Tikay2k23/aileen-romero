"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Expand } from "lucide-react";
import { WorkPreviewDialog } from "@/components/ui/work-preview-dialog";

type Product = {
  title: string;
  thumbnail: string;
  // The button in the card's preview, when the card has somewhere to go
  link?: string;
  linkLabel?: string;
};

type HeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export const HeroParallax = ({
  products,
  linkLabel,
  ...header
}: {
  products: Product[];
  // The page's words for the preview's link button ("Visit the site")
  linkLabel: string;
} & HeaderProps) => {
  // A card opens in a preview. It stays selected while the preview closes, so the content doesn't vanish mid-fade.
  const [selected, setSelected] = React.useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const openPreview = (product: Product) => {
    setSelected(product);
    setPreviewOpen(true);
  };

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header {...header} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse gap-10 md:gap-20 mb-10 md:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              onSelect={openPreview}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 md:mb-20 gap-10 md:gap-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              onSelect={openPreview}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse gap-10 md:gap-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              onSelect={openPreview}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
      <WorkPreviewDialog
        project={selected}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        eyebrow={header.eyebrow}
        linkLabel={linkLabel}
      />
    </div>
  );
};

export const Header = ({ eyebrow, title, description }: HeaderProps) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      {eyebrow && (
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl text-4xl md:text-7xl font-bold tracking-tight text-balance dark:text-white">
        {title}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-muted-foreground dark:text-neutral-200">
        {description}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  onSelect,
}: {
  product: Product;
  translate: MotionValue<number>;
  onSelect: (product: Product) => void;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-60 w-[20rem] md:h-96 md:w-[30rem] relative shrink-0"
    >
      {/* Opens the card's preview */}
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Preview: ${product.title}`}
        className="relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl outline-none group-hover/product:shadow-2xl focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-2xl"
          alt={product.title}
        />
      </button>
      {/* The overlay, title and expand cue show on hover, and when the card is reached with the keyboard */}
      <div className="absolute inset-0 h-full w-full rounded-2xl opacity-0 group-hover/product:opacity-80 group-has-[:focus-visible]/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 text-xl font-semibold opacity-0 group-hover/product:opacity-100 group-has-[:focus-visible]/product:opacity-100 text-white pointer-events-none">
        {product.title}
      </h2>
      <span
        aria-hidden
        className="pointer-events-none absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-black opacity-0 transition-opacity group-hover/product:opacity-100 group-has-[:focus-visible]/product:opacity-100"
      >
        <Expand className="size-4" />
      </span>
    </motion.div>
  );
};
