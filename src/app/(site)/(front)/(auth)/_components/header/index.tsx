import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="mb-6 flex gap-1 items-center">
      <Image
        alt="Pinguins Log"
        src={"/brand-asset-profile-picture.png"}
        width={300}
        height={300}
        className="rounded-full size-4"
      />
      <Link href="/" className="flex text-lg z-40 font-semibold">
        Ping<span className="text-brand-primary-600">quins</span>
      </Link>
    </nav>
  );
}
