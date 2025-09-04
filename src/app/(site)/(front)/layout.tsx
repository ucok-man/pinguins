import BgPattern from "@/components/bg-pattern";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <BgPattern />
      {children}
    </div>
  );
}
