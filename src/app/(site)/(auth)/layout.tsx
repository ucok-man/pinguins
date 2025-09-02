import { ReactNode } from "react";
import Header from "./_components/header";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-1px)] size-full flex flex-col items-center justify-center">
      <Header />
      <div>{children}</div>
    </div>
  );
}
