import MaxWidthWrapper from "@/components/max-width-wrapper";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "../logo";
import { Button, buttonVariants } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-brand-secondary-100 bg-brand-primary-50/50 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          <div className="h-full flex items-center space-x-4">
            {/* Sign in view */}

            <SignedIn>
              <SignOutButton>
                <Button size="sm" variant="ghostLink">
                  Sign out
                </Button>
              </SignOutButton>

              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "sm",
                  className: "sm:flex items-center gap-1",
                })}
              >
                Dashboard <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </SignedIn>

            {/* Sign out view */}
            <SignedOut>
              <Link
                href="/pricing"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghostLink",
                })}
              >
                Pricing
              </Link>

              <div className="h-8 w-px bg-brand-secondary-200" />

              <Link
                href="/sign-in"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghostLink",
                })}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants({
                  size: "sm",
                  className: "flex items-center gap-1.5",
                })}
              >
                Sign up <ArrowRight className="size-4" />
              </Link>
            </SignedOut>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
