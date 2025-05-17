import React from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaAction?: () => void;
  imageSrc: string;
  imageAlt: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText,
  ctaAction,
  imageSrc,
  imageAlt
}: HeroSectionProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-32 pb-12 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-12 gap-x-8 items-center relative z-10">
        {/* Large background text */}
        <div className="hero-name-display md:col-span-6 lg:col-span-7 text-center md:text-left select-none 
                    absolute md:relative inset-0 md:inset-auto 
                    flex flex-col justify-center items-center md:items-start 
                    -z-10 md:z-0 opacity-05 md:opacity-10 pointer-events-none">
          <h1 className="text-8xl sm:text-9xl md:text-10xl font-extrabold text-foreground/30 uppercase tracking-tighter-xl break-words">
            {title.split(' ')[0] || title}
          </h1>
          {title.split(' ')[1] && (
            <h1 className="text-8xl sm:text-9xl md:text-10xl font-extrabold text-foreground/30 uppercase tracking-tighter-xl -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12 break-words">
              {title.split(' ')[1]}
            </h1>
          )}
        </div>

        {/* Profile image */}
        <div className="md:col-span-3 lg:col-span-3 flex justify-center relative order-first md:order-none my-8 md:my-0 
                      md:-ml-8 lg:-ml-12 xl:-ml-20">
          <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] md:max-w-xs lg:max-w-sm aspect-[4/5]">
            <Image 
              src={imageSrc}
              alt={imageAlt}
              width={320}
              height={400}
              className="rounded-lg shadow-2xl object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-4 lg:col-span-3 text-center md:text-left relative z-0 md:pl-0 lg:pl-0 order-last md:order-none">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1 tracking-wide">
            {subtitle}
          </h2>
          <div className="w-16 h-0.5 bg-primary mb-4 mx-auto md:mx-0"></div>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
          <Button 
            onClick={ctaAction} 
            className="bg-accent text-accent-foreground font-bold py-3 px-8 rounded-lg text-base sm:text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-opacity-50"
          >
            {ctaText}
          </Button>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-accent rounded-full opacity-20 pointer-events-none -z-20 blur-lg"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-primary/70 rounded-full opacity-05 pointer-events-none -z-20 blur-2xl"></div>
    </div>
  );
}
