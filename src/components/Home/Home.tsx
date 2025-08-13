"use client";
import React from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

const HomeComponent = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title", { y: 30, opacity: 0, duration: 0.8 })
        .from(
          ".hero-subtitle",
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.4"
        )
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .from(
          ".hero-logos",
          { opacity: 0, duration: 0.6 },
          "-=0.2"
        );

      gsap.from(".hero-side", {
        x: (index: number) => (index === 0 ? -50 : 50),
        opacity: 0,
        duration: 0.8,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="flex flex-col items-center justify-center gap-6 sm:gap-8 min-h-screen relative overflow-hidden px-4 sm:px-6">
      <div className="hero-side h-full absolute left-0 top-0 hidden md:block pointer-events-none select-none">
        <Image
          src="https://res.cloudinary.com/dtvr83fb3/image/upload/v1754970594/Home-1_smcjwp.png"
          alt="Hero"
          width={305}
          height={300}
          sizes="(min-width: 768px) 305px, 0px"
        />
      </div>
      <div className="hero-side h-full absolute right-0 top-0 hidden md:block pointer-events-none select-none">
        <Image
          src="https://res.cloudinary.com/dtvr83fb3/image/upload/v1754970598/Home-2_in7ocm.png"
          alt="Hero"
          width={350}
          height={350}
          className="object-cover"
          sizes="(min-width: 768px) 350px, 0px"
        />
      </div>

      <div className="rounded-2xl px-6 sm:px-8 py-8 sm:py-10 text-center space-y-3 sm:space-y-4 border border-foreground/10 bg-card/60 backdrop-blur max-w-2xl w-full">
        <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl text-foreground font-bold leading-tight">
          Ehgezly Trusted Your <br />
          Task Every for
        </h1>
        <p className="hero-subtitle text-base md:text-xl text-foreground/80 max-w-2xl mx-auto">
          EhgezlY Trusted Your Task Every for
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-2xl justify-center items-center">
        <button className="hero-cta w-full sm:w-auto px-6 sm:px-8 py-3 glass rounded-lg transition-colors font-semibold text-foreground shadow-sm">
          Get Started
        </button>
        <button className="hero-cta w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg transition-colors border border-foreground/15 text-foreground/90 hover:bg-foreground/10">
          Learn More
        </button>
      </div>
      {/* Trusted by logos */}
      <div className="hero-logos mt-12 sm:mt-16 w-full max-w-5xl px-2 sm:px-0">
        <p className="text-center text-foreground/70 text-xs sm:text-base">
          Trusted by top companies to clean their offices
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon"
            width={120}
            height={28}
            className="h-6 sm:h-7 w-auto opacity-90 dark:invert saturate-0"
            sizes="(max-width: 640px) 96px, 120px"
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            width={120}
            height={28}
            className="h-6 sm:h-7 w-auto opacity-90 dark:invert saturate-0"
            sizes="(max-width: 640px) 96px, 120px"
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft"
            width={140}
            height={28}
            className="h-6 sm:h-7 w-auto opacity-90 dark:invert saturate-0"
            sizes="(max-width: 640px) 112px, 140px"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
