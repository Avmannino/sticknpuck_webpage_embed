// src/app/App.tsx
import type React from "react";
import { useEffect, useMemo, useState } from "react";

import logo from "../assets/wingslogo.png";
import familyIcon from "../assets/familyicon.png";
import allAgesIcon from "../assets/agesicon.png";
import heroImage1 from "../assets/hero/hero-1.jpg";
import heroImage2 from "../assets/hero/hero-2.jpg";
import heroImage3 from "../assets/hero/hero-3.jpg";
import heroImage4 from "../assets/hero/hero-4.jpg";

// ✅ REMOVED: catchCornerLogo import (unused since Parties/Ice Booking section is removed)
// import catchCornerLogo from "../assets/logos/catchcorner.png";

import { HeroCarousel } from "@/app/components/HeroCarousel";
import { InfoBox } from "@/app/components/InfoBox";
import { PriceCard } from "@/app/components/PriceCard";
import { ScheduleTable } from "@/app/components/ScheduleTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Snowflake, Cross } from "lucide-react";

export default function App() {
  const heroImages = [
    { url: heroImage3, alt: "Wings Arena seating area" },
    { url: heroImage1, alt: "Wings Arena ice rink facility" },
    { url: heroImage2, alt: "Wings Arena ice rink view" },
    { url: heroImage4, alt: "Ice skates rental" },
  ];

  // Track breakpoints in JS so we can (a) scroll correctly and (b) remount schedule when layout changes.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  const [isUnder1000, setIsUnder1000] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1000px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mq1000 = window.matchMedia("(max-width: 1000px)");

    const onDesktopChange = () => setIsDesktop(mqDesktop.matches);
    const on1000Change = () => setIsUnder1000(mq1000.matches);

    // Safari fallback support
    if (mqDesktop.addEventListener)
      mqDesktop.addEventListener("change", onDesktopChange);
    else mqDesktop.addListener(onDesktopChange);

    if (mq1000.addEventListener)
      mq1000.addEventListener("change", on1000Change);
    else mq1000.addListener(on1000Change);

    // Initialize
    onDesktopChange();
    on1000Change();

    return () => {
      if (mqDesktop.removeEventListener)
        mqDesktop.removeEventListener("change", onDesktopChange);
      else mqDesktop.removeListener(onDesktopChange);

      if (mq1000.removeEventListener)
        mq1000.removeEventListener("change", on1000Change);
      else mq1000.removeListener(on1000Change);
    };
  }, []);

  // Remount ScheduleTable when the <=1000 layout mode changes
  const scheduleKey = useMemo(
    () => (isUnder1000 ? "schedule-under-1000" : "schedule-over-1000"),
    [isUnder1000]
  );

  const smoothScrollToEl = (el: HTMLElement, id?: string) => {
    if (id) {
      try {
        window.history.replaceState(null, "", `#${id}`);
      } catch {
        // ignore
      }
    }

    const offset = 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const scrollToId =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      smoothScrollToEl(el, id);
    };

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = isDesktop ? "pricing-desktop" : "pricing-mobile";
    const el = document.getElementById(targetId);
    if (!el) return;
    smoothScrollToEl(el, targetId);
  };

  // ✅ One shadow token you can reuse everywhere (cards/images/buttons/schedule wrappers)
  const SHADOW = "shadow-[0_8px_20px_rgba(0,0,0,0.45)]";

  // ✅ Keep these referenced so TS doesn't flag them as unused
  void scrollToId;
  void scrollToPricing;

  return (
    <div className="min-h-screen bg-[#0e633c] flex flex-col sm:block">
      {/* Header */}
      <header className="bg-[#0e633c] border-b border-[#b2dbd7]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-4">
          <nav className="flex items-center justify-between"></nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0e633c] border-b border-[#b2dbd7]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 xl:px-0 py-12">
          <div className="grid lg:grid-cols-12 gap-y-8 lg:gap-y-8 lg:gap-x-16 xl:gap-x-30 items-center">
            {/* LEFT (text) */}
            <div className="lg:col-span-7 lg:-ml-[60px] min-[1001px]:max-[1325px]:ml-0 min-[1001px]:max-[1325px]:pr-5">
              {/* ✅ Center logo + header + divider to match centered text below */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={logo}
                  alt="Wings Arena"
                  className="w-[100.04px] mt-[-50px] -mb-[15px]"
                />

                <h1 className="text-4xl lg:text-5xl text-white text-center">
                  Stick &amp; Puck
                </h1>

                <div className="mt-[15px] -mb-[10px] h-px w-full max-w-[52rem] bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />
              </div>

              {/* ✅ Center the hero copy block and give it a nice wide max width */}
              <div className="text-gray-300 mb-4 space-y-5 text-center text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed mx-auto max-w-[52rem]">
                <p>
                  Stick &amp; Puck is open ice time for individual skill
                  development. Work on shooting, passing, stickhandling, and
                  skating at your own pace—no organized games or scrimmages.
                </p>

                <p>
                  Great for goalies looking for extra reps, or parents and kids
                  who want quality ice time together.
                </p>

                <p className="text-gray-200">
                  Please note: Stick &amp; Puck sessions are not intended for
                  private lessons with coaches. If you’re interested in booking
                  private lesson ice time, please contact us for more
                  information.
                </p>
              </div>

              {/* Buttons kept commented out per your original */}
              {/*
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="#schedule"
                  onClick={scrollToId("schedule")}
                  className={`bg-[#b2dbd7] text-gray-900 px-6 py-3 rounded-md hover:bg-[#9ccbc7] hover:scale-105 transition-all inline-block ${SHADOW}`}
                >
                  View Schedule
                </a>
                <a
                  href="#pricing"
                  onClick={scrollToPricing}
                  className={`bg-transparent text-white px-6 py-3 rounded-md border border-red-700 hover:bg-gray-800 hover:scale-105 transition-all inline-block ${SHADOW}`}
                >
                  Pricing
                </a>
              </div>
              */}
            </div>

            {/* RIGHT (carousel) */}
            <div className="lg:col-span-5">
              <div
                className={`
                  relative h-64 sm:h-80 lg:h-96
                  ml-[0px] lg:ml-0
                  min-[1001px]:max-[1325px]:h-[320px]
                  min-[1001px]:max-[1325px]:ml-0
                  min-[1001px]:max-[1325px]:scale-[0.93]
                  min-[1001px]:max-[1325px]:origin-top-left
                  ${SHADOW}
                  rounded-lg overflow-hidden
                `}
              >
                <HeroCarousel images={heroImages} interval={3000} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reorder Schedule before Info Boxes ONLY at widths <= 1000px */}
      <div className="max-[1000px]:flex max-[1000px]:flex-col">
        {/* Info Boxes */}
        <section className="max-w-[calc(80rem*0.97+200px)] mx-auto px-0 sm:px-6 xl:px-8 py-8 max-[1000px]:order-2 max-[1000px]:pt-0 max-[1000px]:-mt-[18px] lg:mt-[25px]">
          <div className="max-[640px]:w-[100vw] max-[640px]:ml-[calc(50%-50vw)] max-[640px]:px-3 max-[640px]:box-border">
            <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[calc(1rem*1.0356)] justify-items-stretch">
              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  iconImage={familyIcon}
                  title="Safety First"
                  description="Some Stick & Puck sessions are age-specific to keep things safe for all skaters."
                  iconSize="w-[28.6px] h-[28.6px]"
                  iconOffset="-mt-[5px]"
                  titleClassName="text-[16px] sm:text-[16px]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight"
                />
              </div>

              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  iconImage={allAgesIcon}
                  title="Skill Development"
                  description="Shoot, pass, stickhandle & skate at your own pace"
                  iconSize="w-[35.35px] h-[35.35px]"
                  iconOffset="-mt-[10px]"
                  textOffset="-mt-[1.5px]"
                  titleClassName="text-[15px] sm:text-[16px]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-snug"
                />
              </div>

              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  icon={Snowflake}
                  title="Goalie Friendly"
                  description="work on movement, angles, rebounds, and puck handling in a relaxed, unstructured session"
                  titleClassName="text-[16px] sm:text-[16px]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight"
                  iconOffset="-mt-[0px]"
                  textOffset="-mt-[3.5px]"
                />
              </div>

              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  icon={Cross}
                  title="Casual Practice"
                  description="shoot, stickhandle, skate, and work on your game"
                  titleClassName="text-[16px] sm:text-[16px]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight"
                  iconOffset="-mt-[6px]"
                  textOffset="-mt-[3.5px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section
          id="schedule"
          className="bg-[#0e633c] py-12 max-[1000px]:order-1"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
            <div className="flex flex-col gap-6 sm:gap-8 min-[1001px]:items-center">
              <div
                className={[
                  "order-1 w-full",
                  "max-[1000px]:-mt-[47px] max-[1000px]:mx-0",
                  "min-[1001px]:mx-auto",
                  "min-[1001px]:w-[clamp(760px,72vw,1240px)]",
                  "min-[1001px]:-mt-[30px]",
                ].join(" ")}
              >
                <h2 className="text-[1.50125rem] sm:text-4xl mb-7 mt-7 min-[1001px]:mb-11 text-white text-center">
                  Upcoming Stick &amp; Puck Sessions
                </h2>
                <div className="mb-[20px] -mt-[12px] h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

                <div
                  className={`bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 w-full min-w-0 overflow-visible ${SHADOW}`}
                >
                  <ScheduleTable key={scheduleKey} />
                </div>
              </div>

              {/* Pricing Section - mobile */}
              <div className="order-2 lg:hidden mt-0">
                <h2
                  id="pricing-mobile"
                  className="text-[1.7rem] sm:text-[2.15625rem] mb-2 sm:mb-8 text-white text-center mt-[0px] sm:mt-0"
                ></h2>

                <div
                  className="flex justify-center w-full"
                  style={{
                    ["--pc-w" as any]: "clamp(140px, 56vw, 163px)",
                    ["--pc-gap" as any]: "clamp(6px, 3vw, 28px)",
                    ["--pc-title" as any]: "clamp(14px, 2.2vw, 20px)",
                    ["--pc-price" as any]: "clamp(24px, 4.6vw, 42px)",
                    ["--pc-desc" as any]: "clamp(12px, 1.8vw, 14px)",
                    ["--pc-feat" as any]: "clamp(12px, 1.7vw, 14px)",
                  }}
                >
                  <div className="grid grid-flow-col items-stretch justify-center gap-x-[var(--pc-gap)] auto-cols-[clamp(132px,56vw,200px)] max-[450px]:auto-cols-[clamp(108px,46vw,150px)] min-[601px]:max-[1000px]:auto-cols-[clamp(220px,35vw,340px)]">
                    <div
                      className={`h-full flex [&>*]:h-full [&>*]:w-full [&>*]:mx-0 [&>*]:${SHADOW}`}
                    >
                      <PriceCard
                        title="Admission"
                        price="$20"
                        description="Per skater"
                      />
                    </div>

                    <div
                      className={`h-full flex [&>*]:h-full [&>*]:w-full [&>*]:mx-0 [&>*]:${SHADOW}`}
                    >
                      <PriceCard
                        title="Equipment Required"
                        price="Required"
                        description="Helmet • Skates • Stick • Gloves"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* (cards section commented out in your original) */}
            </div>
          </div>
        </section>
      </div>

      {/* Pricing Section - desktop */}
      <section
        id="pricing-desktop"
        className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-20 lg:-mt-[75px]"
      >
        <h2 className="text-[2rem] sm:text-[2.15625rem] mb-1 text-white text-center"></h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[856px] mx-auto gap-8 sm:gap-12 lg:gap-[72px]">
          <div className={`[&>*]:${SHADOW}`}>
            <PriceCard
              title="Admission"
              price="$20"
              description="Per skater"
              features={[
                "Limited openings per session",
                "Rental Skates & Helmets Available!",
                "Casual practice only — please save scrimmages for our Open-Hockey sessions.",
              ]}
            />
          </div>

          <div className={`[&>*]:${SHADOW}`}>
            <PriceCard
              title="Equipment Required"
              price=""
              description="Helmet • Skates • Stick • Gloves"
              features={[
                "Helmet",
                "Skates (Rentals Available)",
                "Stick",
                "Gloves",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#0e633c] py-12 sm:py-12 pt-0 sm:pt-12 order-1 sm:order-none mt-[35px] sm:mt-0 -translate-y-[15px]">
        <div className="max-w-[58.08rem] mx-auto px-4 sm:px-6 xl:px-8">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-white text-center">
            Frequently Asked Questions
          </h2>
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

          <Accordion
            type="single"
            collapsible
            className={`bg-[#1e2a3a] rounded-lg border border-gray-700 px-4 sm:px-6 text-white ${SHADOW}`}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white">
                What is Stick &amp; Puck?
              </AccordionTrigger>
              <AccordionContent className="text-white">
                Stick &amp; Puck is unstructured open ice for individual skill
                development—shooting, passing, stickhandling, and skating at
                your own pace. It is not an organized game or scrimmage.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-white">
                What equipment do I need?
              </AccordionTrigger>
              <AccordionContent className="text-white">
                A helmet, skates, stick, and gloves are required for all
                participants. Rental skates and helmets are available. We
                recommend shin pads and elbow pads for added protection.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-white">
                Is Stick &amp; Puck goalie friendly?
              </AccordionTrigger>
              <AccordionContent className="text-white">
                Yes—goalies are welcome. Stick &amp; Puck is a great environment
                to work on movement, angles, rebound control, and puck handling
                in a relaxed, unstructured setting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-white">
                Can I take private lessons during Stick &amp; Puck?
              </AccordionTrigger>
              <AccordionContent className="text-white">
                Stick &amp; Puck sessions are not intended for private lessons
                with coaches. If you’re interested in booking private lesson ice
                time, please contact us for more information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-white">
                Are sessions separated by age or skill level?
              </AccordionTrigger>
              <AccordionContent className="text-white">
                Some Stick &amp; Puck sessions are age-specific to help keep
                things safe and comfortable for all skaters. Please check the
                schedule on our home page for details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
