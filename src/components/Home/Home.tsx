import React from "react";
import Image from "next/image";

const HomeComponent = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh)] relative overflow-clip">
      <div className="h-full absolute left-0 top-0 ">
        <Image
          src="https://res.cloudinary.com/dtvr83fb3/image/upload/v1754970594/Home-1_smcjwp.png"
          alt="Hero"
          width={305}
          height={300}
        />
      </div>
      <div className="h-full absolute right-0 top-0 ">
        <Image
          src="https://res.cloudinary.com/dtvr83fb3/image/upload/v1754970598/Home-2_in7ocm.png"
          alt="Hero"
          width={350}
          height={350}
          className="object-cover"
        />
      </div>

      <div className=" rounded-2xl px-8 py-10 text-center space-y-4 border border-foreground/10 bg-card/60 backdrop-blur">
        <h1 className="text-4xl md:text-6xl text-foreground font-bold">
          Ehgezly Trusted Your <br />
          Task Every for
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl">
          EhgezlY Trusted Your Task Every for
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button className="px-8 py-3 glass rounded-lg transition-colors font-semibold text-foreground">
          Get Started
        </button>
        <button className="px-8 py-3 rounded-lg transition-colors border border-foreground/15 text-foreground/90 hover:bg-foreground/10">
          Learn More
        </button>
      </div>
      {/* Trusted by logos */}
      <div className="mt-16 w-full max-w-5xl">
        <p className="text-center text-foreground/70 text-sm sm:text-base">
          Trusted by top companies to clean their offices
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon"
            width={120}
            height={28}
            className="h-7 w-auto opacity-90 dark:invert saturate-0"
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            width={120}
            height={28}
            className="h-7 w-auto opacity-90 dark:invert saturate-0"
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft"
            width={140}
            height={28}
            className="h-7 w-auto opacity-90 dark:invert saturate-0"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
