import { AnimatedList } from "@/components/animated-list";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import DiscordMessage from "./discord-message";
import MockDiscordUI from "./mock-discord-ui";

export default function SectionDiscord() {
  return (
    <section className="relative bg-brand-primary-50 pb-4">
      <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-primary-700" />
      <MaxWidthWrapper className="relative mx-auto">
        <div className="-m-2 rounded-xl bg-brand-secondary-900/5 p-2 ring-1 ring-inset ring-brand-secondary-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
          <MockDiscordUI>
            <AnimatedList>
              <DiscordMessage
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="Pinguins Avatar"
                username="Pinguins"
                timestamp="Today at 12:35PM"
                badgetext="SignUp"
                badgeStyle="bg-green-500/10 text-green-400 ring-green-500/20"
                title="👤 New user signed up"
                content={{
                  name: "Mateo Ortiz",
                  email: "m.ortiz99@gmail.com",
                }}
              />
              <DiscordMessage
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="Pinguins Avatar"
                username="Pinguins"
                timestamp="Today at 12:35PM"
                badgetext="Revenue"
                badgeStyle="bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                title="💰 Payment received"
                content={{
                  amount: "$49.00",
                  email: "zoe.martinez2001@email.com",
                  plan: "PRO",
                }}
              />
              <DiscordMessage
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="Pinguins Avatar"
                username="Pinguins"
                timestamp="Today at 5:11AM"
                badgetext="Milestone"
                badgeStyle="bg-blue-500/10 text-blue-400 ring-blue-500/20"
                title="🚀 Revenue Milestone Achieved"
                content={{
                  recurringRevenue: "$5.000 USD",
                  growth: "+8.2%",
                }}
              />
            </AnimatedList>
          </MockDiscordUI>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
