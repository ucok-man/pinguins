"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { exampleFetchCodeSnippet } from "@/lib/utils";
import { ArrowRight, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function QuickstartGuide() {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(exampleFetchCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-2xl sm:ml-2">
      {/* Step 1 */}
      <SectionBox
        title="Connect Your Discord Account"
        step="01"
        href="/dashboard/integrations"
      >
        <p>
          Navigate to the integrations page and authorize your Discord account
          to get started. This will join you to our server and start getting
          notification.
        </p>
      </SectionBox>

      <Separator />

      {/* Step 2 */}
      <SectionBox title="Create Event Category" step="02" href="/dashboard">
        <p>
          Visit your dashboard page to create a new event category. This will
          help you organize different types of events and customize their
          settings.
        </p>
      </SectionBox>

      <Separator />

      {/* Step 3 */}

      <SectionBox title="Integrate with Your Application" step="03">
        <div className="space-y-6">
          <p>
            Copy and paste this code snippet into your application to start
            fetching events. Remember to replace the authentication details and
            body with your actual values.
          </p>

          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden relative group">
            {/* Terminal header with colored dots */}
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm">example.js</span>
            </div>

            {/* Code syntax highlighter */}
            <SyntaxHighlighter
              language="javascript"
              style={oneDark}
              customStyle={{
                borderRadius: "0px",
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                // overflow: "scroll",
              }}
            >
              {exampleFetchCodeSnippet()}
            </SyntaxHighlighter>

            {/* Copy */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-11 right-3 h-8 w-8 p-0 text-slate-400 hover:text-slate-50 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-50"
              onClick={copyCode}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
            {copiedCode && (
              <div className="absolute top-11 right-14 bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium">
                Copied!
              </div>
            )}
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

type SectionBoxProp = {
  children: ReactNode;
  title: string;
  href?: string;
  step: string;
};

function SectionBox(props: SectionBoxProp) {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-slate-50/50 to-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-brand-primary-600 text-white border-0"
          >
            {props.step}
          </Badge>
          <CardTitle className="text-xl">{props.title}</CardTitle>
        </div>

        {props.href && (
          <div
            className="cursor-pointer text-muted-foreground hover:bg-primary/10 rounded-md p-1"
            onClick={() => router.push(props.href!)}
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="ml-11 text-sm text-muted-foreground">
        {props.children}
      </div>
    </section>
  );
}
