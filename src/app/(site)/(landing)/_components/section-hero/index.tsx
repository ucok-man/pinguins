import MaxWidthWrapper from "@/components/max-width-wrapper";
import ShinyButton from "@/components/shiny-button";
import TextH1 from "@/components/text-h1";
import { Check } from "lucide-react";

export default function SectionHero() {
  return (
    <section className="py-24 sm:py-32 bg-brand-25">
      <MaxWidthWrapper className="relative">
        <div className="relative mx-auto text-center flex flex-col items-center gap-10">
          <div>
            <TextH1>
              <span>Real-Time SaaS Insights</span>
              <br />
              <span className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-transparent bg-clip-text">
                Delivered to Your Discord
              </span>
            </TextH1>
          </div>

          <p className="text-base/7 text-brand-gray-600 max-w-prose text-center text-pretty">
            Pinguins is the easiest way to monitor your SaaS. Get instant
            notifications for{" "}
            <span className="font-semibold text-brand-gray-700">
              sales, new users, or any other event
            </span>{" "}
            sent directly to your discord
          </p>

          <ul className="space-y-2 text-base/7 text-brand-gray-600 text-left flex flex-col items-start">
            {[
              "Real-time Discord alerts for critical events",
              "Buy once, use forever",
              "Track sales, new users, or any other event",
            ].map((item, idx) => (
              <li key={idx} className="flex gap-1.5 items-center">
                <Check className="size-5 shrink-0 text-brand-primary-600" />
                {item}
              </li>
            ))}
          </ul>

          <div className="w-full max-w-80">
            <ShinyButton
              className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
              href="/sign-up"
            >
              Start For Free Today
            </ShinyButton>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
