import SectionBento from "./_components/section-bento";
import SectionDiscord from "./_components/section-discord";
import SectionFeedback from "./_components/section-feedback";
import SectionHero from "./_components/section-hero";

export default function LandingPage() {
  return (
    <div>
      <SectionHero />
      <SectionDiscord />
      <SectionBento />
      <SectionFeedback />
    </div>
  );
}
