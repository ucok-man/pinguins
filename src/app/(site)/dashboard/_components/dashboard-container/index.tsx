"use client";

import TextH1 from "@/components/text-h1";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ArrowLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  title: string;
  children?: React.ReactNode;
  hideBackButton?: boolean;
  cta?: React.ReactNode;
};

export default function DashboardContainer({
  title,
  children,
  cta,
  hideBackButton = false,
}: Props) {
  const router = useRouter();
  const { toggleSidebar, openMobile } = useSidebar();

  return (
    <section className="size-full flex flex-col">
      <div className="p-6 sm:p-8 flex flex-row w-full justify-between items-start gap-x-2  border-b">
        {/* Header Title */}
        <div className="flex-1 flex flex-col lg:flex-row lg:gap-x-8 justify-start items-center">
          <div className="flex justify-start items-center gap-x-8">
            {!hideBackButton && (
              <Button
                className="w-fit bg-white"
                variant={"outline"}
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}

            <TextH1>{title}</TextH1>
          </div>

          {cta && <div className="max-lg:w-full max-lg:mt-6">{cta}</div>}
        </div>

        <button
          onClick={() => toggleSidebar()}
          className={cn(
            "text-gray-500 hover:text-gray-600 block md:hidden cursor-pointer duration-300 rotate-0",
            openMobile && "rotate-180"
          )}
        >
          <Menu className="size-6" />
        </button>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
