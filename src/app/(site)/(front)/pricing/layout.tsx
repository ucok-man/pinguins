import Navbar from "@/components/navbar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-1px)] size-full flex flex-col items-center justify-center">
      <Navbar />
      {children}
    </div>
  );
}
