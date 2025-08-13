"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getServices } from "@/app/providerDashboard/_actions/Service.action";
import type { Service, User, Slot } from "@prisma/client";
import Link from "next/link";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import gsap from "gsap";

const SwiperComponent = () => {
  type ServiceWithRelations = Service & { provider: User; slots: Slot[] };
  const [data, setData] = useState<ServiceWithRelations[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
	const [imagesLoaded, setImagesLoaded] = useState(0);
	const [imagesReady, setImagesReady] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getServices();
      if (response.success) {
        setData(response.data);
      } else {
        setData([]);
      }
    };
    fetchData();
  }, []);
	const hasData = data.length > 0;

	// Reset images loading counters when data changes
	useEffect(() => {
		if (!hasData) return;
		setImagesLoaded(0);
		setImagesReady(false);
	}, [hasData, data.length]);

  // Animate cards on mount/data load
	useEffect(() => {
		if (!rootRef.current || !hasData || !imagesReady) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".service-card");
      if (!cards.length) return;
			gsap.set(cards, { opacity: 0, y: 24, scale: 0.98 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, rootRef);
    return () => ctx.revert();
	}, [hasData, imagesReady]);

	// Detect readiness when a threshold of images has loaded
	useEffect(() => {
		if (!hasData) return;
		const targetCount = Math.min(4, data.length);
		if (imagesLoaded >= targetCount && !imagesReady) {
			setImagesReady(true);
		}
	}, [imagesLoaded, imagesReady, data.length, hasData]);

  const handleSlideChange = () => {
    if (!rootRef.current) return;
    const activeCard = rootRef.current.querySelector<HTMLElement>(
      ".swiper-slide-active .service-card"
    );
    if (!activeCard) return;
    gsap.fromTo(
      activeCard,
      { opacity: 0.6, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  };

	// Kick first active slide animation after images are ready
	useEffect(() => {
		if (imagesReady) handleSlideChange();
	}, [imagesReady]);
  return (
    <div ref={rootRef} className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-foreground">
        Discover Most Popular Services
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Explore our most in-demand services, trusted by customers for their
        exceptional quality and reliability.
      </p>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={16}
        slidesPerView={1.2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={hasData && data.length > 1}
        className="w-full max-w-7xl py-2"
        onSlideChange={handleSlideChange}
        onSwiper={() => handleSlideChange()}
        breakpoints={{
          360: { slidesPerView: 1.2, spaceBetween: 12 },
          640: { slidesPerView: 2, spaceBetween: 14 },
          1024: { slidesPerView: 3, spaceBetween: 16 },
          1280: { slidesPerView: 4, spaceBetween: 18 },
        }}
      >
        {hasData
          ? data.map((item, idx) => (
              <SwiperSlide key={item.id}>
                <Link href={`/services/${item.id}`} className="block">
                  <div className="service-card group relative h-120 rounded-2xl overflow-hidden bg-background shadow-lg transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl">
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-sm font-semibold text-foreground shadow">
                      {item.price} EGP
                    </span>
					<Image
                      src={item.image || ""}
                      alt={item.provider?.name || "service image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
						priority={idx < 4}
						onLoadingComplete={() => setImagesLoaded((c) => c + 1)}
						onLoad={() => setImagesLoaded((c) => c + 1)}
						onError={() => setImagesLoaded((c) => c + 1)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent backdrop-blur-lg">
                      <div className="space-y-2">
                        <h3 className="text-white text-lg font-bold tracking-tight line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed text-ellipsis line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur border border-white/30">
                            <span className="text-white text-xs font-semibold">
                              {item.provider?.name?.[0]?.toUpperCase() ?? "؟"}
                            </span>
                          </div>
                          <span className="text-white/95 text-sm font-medium truncate">
                            {item.provider?.name || "provider"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          : Array.from({ length: 4 }).map((_, idx) => (
              <SwiperSlide key={`skeleton-${idx}`}>
                <div className="relative h-80 rounded-2xl overflow-hidden bg-muted animate-pulse" />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
