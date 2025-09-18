"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrismaUser } from "@/hooks/use-prisma-user";
import { CheckIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentSuccessModal() {
  const [isOpen, setIsOpen] = useState(true);
  const user = usePrismaUser({ pollPlan: true });
  const isPaymentSuccessful = user.data?.plan === "PRO";

  useEffect(() => {
    if (user.isError) {
      toast.error("Oops! something went wrong 🫣");
    }
  }, [user.isError]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={!isPaymentSuccessful ? undefined : setIsOpen}
    >
      <DialogContent className="sm:max-w-md shadow-2xl">
        {user.data && isPaymentSuccessful ? (
          <SuccessContent onClose={() => setIsOpen(false)} />
        ) : (
          <LoadingContent />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/dashboard");
  };

  return (
    <>
      <DialogHeader className="space-y-6">
        <div className="mx-auto relative">
          <div className="relative aspect-video border border-gray-100 w-full max-w-xs overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
            <Image
              src="/brand-asset-heart.png"
              className="h-full w-full object-cover"
              alt="Payment success"
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
            <CheckIcon className="size-4 text-white" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="size-5 text-yellow-500" />
            Upgrade Successful!
            <Sparkles className="size-5 text-yellow-500" />
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
            Thank you for upgrading to Pro and supporting Pinguins. Your account
            has been upgraded and you now have access to all Pro features.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="pt-2">
        <Button onClick={handleClose} className="h-12 w-full">
          <CheckIcon className="mr-2 size-5" />
          Go to Dashboard
        </Button>
      </div>
    </>
  );
}

function LoadingContent() {
  return (
    <div className="py-12">
      <DialogHeader className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Spinner />
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Upgrading Your Account
            </DialogTitle>
            <DialogDescription className="text-gray-600 leading-relaxed max-w-sm">
              Please wait while we process your upgrade. This may take a moment
              to complete.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
}
