"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import Icons from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePrismaUser } from "@/hooks/use-prisma-user";

import { api } from "@/lib/api-client";
import {
  AlertCircleIcon,
  CheckIcon,
  ExternalLinkIcon,
  InfoIcon,
  LoaderIcon,
} from "lucide-react";
import { toast } from "sonner";

// --- Utilities -------------------------------------------------------------
const DISCORD_ID_REGEX = /^\d{17,19}$/;
const validateDiscordId = (id: string) => DISCORD_ID_REGEX.test(id.trim());

// Small presentational subcomponents keep the main render tidy
function StatusBadge({ connected }: { connected: boolean }) {
  if (!connected) return null;
  return (
    <Badge variant="default" className="gap-1">
      <CheckIcon className="size-3" />
      Connected
    </Badge>
  );
}

function InfoPanel() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
      <InfoIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">How to find your Discord ID:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Enable Developer Mode in Discord Settings → Advanced</li>
          <li>Right-click your username and select "Copy User ID"</li>
          <li>Paste the ID here (it should be 17-19 digits)</li>
        </ol>
      </div>
    </div>
  );
}

// --- Component -------------------------------------------------------------
export default function Content() {
  const user = usePrismaUser();

  // Form state
  const [discordId, setDiscordId] = useState<string>("");
  useEffect(() => {
    if (user.data?.discordId) {
      setDiscordId(user.data.discordId);
    }
  }, [user.data?.discordId]);

  const [validationError, setValidationError] = useState<string>("");

  // Mutation (placeholder, replace with real API call)
  const saveDiscordId = useMutation({
    mutationFn: async (id: string) => {
      await api.auth.updateDiscordId.$post({ discordId: id });
    },
    onSuccess: () => {
      setDiscordId("");
      setValidationError("");
      user.refetch();
      toast.success("Success save new discord id 🥳");
    },

    onError: () => {
      toast.error("Oops! something went wrong 🫣");
    },
  });

  // Derived flags
  const trimmed = useMemo(() => discordId.trim(), [discordId]);
  const original = user.data?.discordId ?? "";
  const isChanged = useMemo(
    () => trimmed && trimmed !== original,
    [trimmed, original]
  );
  const canSave = useMemo(
    () => isChanged && !validationError && trimmed.length > 0,
    [isChanged, validationError, trimmed]
  );

  // Keep validation logic consistent and lightweight
  useEffect(() => {
    if (!trimmed || trimmed === original) {
      setValidationError("");
      return;
    }

    if (!validateDiscordId(trimmed)) {
      setValidationError("Discord ID must be 17-19 digits");
    } else {
      setValidationError("");
    }
  }, [trimmed, original]);

  const handleSave = useCallback(() => {
    if (!trimmed) {
      setValidationError("Discord ID is required");
      return;
    }
    if (!validateDiscordId(trimmed)) {
      setValidationError("Please enter a valid Discord ID (17-19 digits)");
      return;
    }
    saveDiscordId.mutate(trimmed);
  }, [trimmed, saveDiscordId]);

  // Compose input classes so the JSX stays clean
  const inputClassName = useMemo(() => {
    if (validationError)
      return "font-mono transition-all duration-200 border-destructive focus-visible:ring-destructive";
    if (isChanged)
      return "font-mono transition-all duration-200 border-primary/40 focus-visible:ring-primary/40";
    return "font-mono transition-all duration-200";
  }, [validationError, isChanged]);

  return (
    <div className="max-w-2xl w-full border-0 bg-gradient-to-br from-card to-card/50">
      <header className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-discord-brand-color">
              <Icons.discord className="size-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Discord Integration</CardTitle>
              <CardDescription>
                Connect your Discord account for notifications
              </CardDescription>
            </div>
          </div>

          <StatusBadge connected={Boolean(user.data?.discordId)} />
        </div>
      </header>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="discord-id" className="text-sm font-medium">
            Discord User ID
          </Label>
          <div className="relative">
            <Input
              id="discord-id"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="*****************"
              className={inputClassName}
            />

            {saveDiscordId.isPending && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {validationError && (
            <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
              <AlertCircleIcon className="size-4" />
              {validationError}
            </p>
          )}

          <InfoPanel />

          <p className="text-sm text-muted-foreground">
            Need help finding your Discord ID?{" "}
            <Link
              href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View detailed guide
              <ExternalLinkIcon className="size-3" />
            </Link>
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isChanged && (
              <span className="text-amber-600 font-medium">
                You have unsaved changes
              </span>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={!canSave || saveDiscordId.isPending}
            className="gap-2 min-w-[120px]"
          >
            {saveDiscordId.isPending ? (
              <>
                <LoaderIcon className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
