import MaxWidthWrapper from "@/components/max-width-wrapper";
import TextH1 from "@/components/text-h1";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CODE_SNIPPET = `await fetch("${process.env.NEXT_PUBLIC_APP_URL}/api/v1/events", 
  {
    method: "POST",
    body: JSON.stringify({
      category: "sale",
      fields: {
        plan: "PRO",
        email: "zoe.martinez2001@email.com",
        amount: 49.00
      }
    }),
    headers: {
      Authorization: "Bearer <YOUR_API_KEY>"
    }
  })`;

export default function SectionBento() {
  return (
    <section className="relative py-24 sm:py-32 bg-brand-25">
      <MaxWidthWrapper className="flex flex-col justify-center items-center gap-16 sm:gap-20 text-pretty">
        <div>
          <h2 className="text-center text-base/7 font-semibold text-brand-primary-600">
            Intuitive Monitoring
          </h2>
          <TextH1 className="text-center">
            Stay ahead with realtime insights
          </TextH1>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
          {/* First Bento */}
          <div className="relative row-start-1 max-lg:row-start-2 lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-primary-100 lg:rounded-l-[2rem]" />
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Easy Integration
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Connect Pinguins with your existing workflows in minutes and
                  call our intuitive logging API from any languagge.
                </p>
              </div>

              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                        send-event.js
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className="max-h-[30rem]">
                      <SyntaxHighlighter
                        language="typescript"
                        style={{
                          ...oneDark,
                          'pre[class*="language-"]': {
                            ...oneDark['pre[class*="language-"]'],
                            background: "transparent",
                          },
                          'code[class*="language-"]': {
                            ...oneDark['code[class*="language-"]'],
                            background: "transparent",
                          },
                        }}
                      >
                        {CODE_SNIPPET}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second bento*/}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-primary-100 rounded-t-[2rem] lg:rounded-tl-lg lg:rounded-tr-[2rem]" />
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 rounded-t-[2rem] lg:rounded-tl-lg lg:rounded-tr-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Track Any Event
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  From new user signups to successful payments, Pinguins
                  notifies you for all critical events in your SaaS.
                </p>
              </div>

              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <Image
                  src={"/bento-any-event.png"}
                  alt="Bento box illustrating event tracking"
                  width={500}
                  height={300}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>

          {/* Third bento */}
          <div className="relative max-lg:row-start-3">
            <div className="absolute inset-px rounded-lg bg-primary-100 rounded-b-[2rem] lg:rounded-bl-lg lg:rounded-br-[2rem]" />
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 rounded-b-[2rem] lg:rounded-bl-lg lg:rounded-br-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                  Realtime notifications
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Get notified about critical events the moment they happen, no
                  matter if you&apos;re at home or on the go.
                </p>
              </div>

              <div className="flex flex-1 items-center justify-start px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <Image
                  src={"/bento-custom-data.png"}
                  alt="Bento box illustrating custom data tracking"
                  width={500}
                  height={300}
                  className="w-full max-h-[100px] max-w-[320px]"
                />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
