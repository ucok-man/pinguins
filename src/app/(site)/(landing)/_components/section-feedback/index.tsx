import Icons from "@/components/icons";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import ShinyButton from "@/components/shiny-button";
import TextH1 from "@/components/text-h1";
import { Star } from "lucide-react";
import Image from "next/image";

export default function SectionFeedback() {
  return (
    <section className="relative py-24 sm:py-32">
      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
        <div>
          <h2 className="text-center text-base/7 font-semibold text-brand-primary-600">
            Real-World Experiences
          </h2>
          <TextH1 className="text-center">What our customers say</TextH1>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 rounded-[2rem] bg-brand-primary-700">
          {/* first customer review */}
          <div className="flex flex-auto flex-col gap-4 p-6 sm:p-8 lg:p-16">
            <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
            </div>

            <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty text-secondary/75">
              Pinguins has been a game-changer for me. I&apos;ve been using it
              for two months now and seeing sales pop up in real-time is super
              satisfying.
            </p>

            <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
              <Image
                src="/user-2.png"
                className="rounded-full object-cover"
                alt="Random user"
                width={48}
                height={48}
              />
              <div className="flex flex-col items-center sm:items-start">
                <p className="font-semibold flex items-center text-secondary/90">
                  Freya Larsson
                  <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                </p>
                <p className="text-sm text-secondary/75">@itsfreya</p>
              </div>
            </div>
          </div>

          {/* second customer review */}
          <div className="flex flex-auto flex-col gap-4 p-6 sm:p-8 lg:p-16">
            <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
              <Star className="size-5 text-orange-400 fill-orange-400" />
            </div>

            <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty text-secondary/75">
              Pinguins&apos;s been paying off for our SaaS. Nice to have simple
              way to see how we&apos;re doing day-to-day. Definitely makes our
              lives easier.
            </p>

            <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
              <Image
                src="/user-1.png"
                className="rounded-full object-cover"
                alt="Random user"
                width={48}
                height={48}
              />
              <div className="flex flex-col items-center sm:items-start">
                <p className="font-semibold flex items-center text-secondary/90">
                  Kai Durant
                  <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                </p>
                <p className="text-sm text-secondary/75">@kdurant_</p>
              </div>
            </div>
          </div>
        </div>

        <ShinyButton
          href="/sign-up"
          className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          Start For Free Today
        </ShinyButton>
      </MaxWidthWrapper>
    </section>
  );
}
