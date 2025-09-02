import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";

type Props = {
  avatarSrc: string;
  avatarAlt: string;
  username: string;
  timestamp: string;
  badgetext?: string;
  badgeStyle?: string;
  title: string;
  content: Record<string, string>;
};

export default function DiscordMessage(props: Props) {
  return (
    <div className="w-full flex items-start justify-start">
      <div className="flex items-center mb-2">
        <Image
          src={props.avatarSrc}
          alt={props.avatarAlt}
          width={40}
          height={40}
          className="object-cover rounded-full mr-3"
        />
      </div>

      <div className="w-full max-w-xl">
        <div className="flex items-center ">
          <p className="font-semibold text-white">{props.username}</p>
          <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-brand-600 text-white rounded">
            APP
          </span>
          <span className="text-gray-400 ml-1.5 text-xs font-normal">
            {props.timestamp}
          </span>
        </div>

        <div className="bg-[#2f3136] text-sm w-full rounded p-3 mb-4 mt-1.5">
          <div className="flex flex-row items-center justify-between mb-2">
            {props.badgetext && (
              <span
                className={cn(
                  "inline-flex order-2 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                  props.badgeStyle
                )}
              >
                {props.badgetext}
              </span>
            )}

            <p className="text-white order-1 text-base/7 font-semibold">
              {props.title}
            </p>
          </div>

          {Object.entries(props.content).map(([k, v]) => (
            <p key={k} className="text-[#dcddde] text-sm/6">
              <span className="text-[#b9bbbe]">{k}:</span> {v}
            </p>
          ))}

          <p className="text-[#72767d] text-xs mt-2 flex items-center">
            <Clock className="size-3 mr-1" />
            {props.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
