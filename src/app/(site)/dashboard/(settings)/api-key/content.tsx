"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePrismaUser } from "@/hooks/use-prisma-user";
import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  ClipboardIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Content() {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<null | string>(null);
  const user = usePrismaUser();

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error("Oops! something went wrong 🫣");
    }
  };

  const regerateApiKey = useMutation({
    mutationFn: async () => {
      const res = await api.auth.regenerateApiKey.$post();
      return await res.json();
    },
    onSuccess: (data) => {
      setNewApiKey(data.apikey);
      user.refetch();
      toast.success("Success creating new api key 🥳");
    },
    onError: () => {
      toast.error("Oops! something went wrong 🫣");
    },
  });

  const handleRegenerate = async () => regerateApiKey.mutate();

  const shadowKey = (key: string) => {
    return key.replace(/./g, "•").slice(0, -8) + key.slice(-8);
  };

  const apiKey = newApiKey ?? user.data?.apikey;

  return (
    <div className="max-w-2xl w-full border-0 bg-gradient-to-br from-card to-card/50">
      <header className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldCheckIcon className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">API Key</CardTitle>
            <CardDescription>
              Secure access token for API authentication
            </CardDescription>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* API Key Input Section */}
        <div className="space-y-3">
          <Label htmlFor="api-key" className="text-sm font-medium">
            Your API Key
          </Label>

          {apiKey ? (
            <div className="relative group">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={showKey ? apiKey : shadowKey(apiKey)}
                readOnly
                className="pr-24 font-mono text-sm bg-muted/30 border-2 transition-all duration-200 group-hover:border-primary/20 focus-within:border-primary/40"
              />
              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? (
                    <EyeOffIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="size-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(apiKey)}
                  className="h-8 w-8 p-0 hover:bg-muted transition-all duration-200"
                  aria-label="Copy API key"
                >
                  {copySuccess ? (
                    <CheckIcon className="size-4 text-green-600 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <ClipboardIcon className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <Input
                id="api-key"
                type={"text"}
                value={""}
                readOnly
                disabled
                className="pr-24 italic font-mono text-sm bg-muted/60 border-2 transition-all duration-200 group-hover:border-primary/20 focus-within:border-primary/40"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {copySuccess && (
            <p className="text-sm text-green-600 animate-in slide-in-from-top-1 duration-200">
              ✓ API key copied to clipboard
            </p>
          )}

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <ShieldCheckIcon className="size-4" />
            Keep your key secret and do not share it with others.
          </p>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div>
            <h4 className="text-sm font-medium text-destructive">
              Regenerate API Key
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              This will invalidate your current key and generate a new one.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRegenerate}
            disabled={regerateApiKey.isPending}
            className="gap-2"
          >
            {regerateApiKey.isPending ? (
              <RefreshCwIcon className="size-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="size-4" />
            )}
            {regerateApiKey.isPending ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
