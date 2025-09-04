import Icons from "@/components/icons";
import {
  Cog,
  Gift,
  Headphones,
  HelpCircle,
  Inbox,
  MenuIcon,
  Mic,
  Phone,
  Pin,
  PlusCircle,
  Search,
  Smile,
  Sticker,
  Store,
  User,
  UserCircle,
  Video,
} from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MockDiscordUI({ children }: Props) {
  return (
    <div className="flex min-h-[800px] w-full max-w-[1200px] bg-discord-background text-white rounded-lg overflow-hidden shadow-lg">
      {/* Server List */}
      <div className="hidden sm:flex w-[72px] bg-[#202225] py-3 flex-col items-center">
        {/* Discord Logo */}
        <div className="size-12 bg-discord-brand-color rounded-2xl flex items-center justify-center mb-2 hover:rounded-xl transition-all duration-200">
          <Icons.discord className="size-3/5 text-white" />
        </div>

        {/* Server List Item */}
        <div className="w-8 h-[2px] bg-discord-background rounded-full my-2"></div>
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="size-12 bg-discord-background rounded-3xl flex items-center justify-center mb-3 hover:rounded-xl transition-all duration-200 hover:bg-discord-brand-color cursor-not-allowed"
          >
            <span className="text-lg font-semibold text-brand-secondary-400">
              {String.fromCharCode(65 + idx)}
            </span>
          </div>
        ))}

        {/* Add server button */}
        <div className="group mt-auto size-12 bg-discord-background rounded-3xl flex items-center justify-center mb-3 hover:rounded-xl transition-all duration-200 hover:bg-discord-brand-color hover:cursor-not-allowed">
          <PlusCircle className="text-discord-timestamp group-hover:text-white" />
        </div>
      </div>

      {/* Direct Message list */}
      <div className="hidden md:flex w-60 bg-[#2f3136] flex-col">
        {/* Search Box */}
        <div className="px-4 h-16 border-b border-[#202225] flex items-center shadow-sm">
          <div className="w-full bg-[#202225] rounded px-2 h-8 flex items-center justify-center text-brand-secondary-500 cursor-not-allowed text-xs">
            Find or start a conversation
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 overflow-y-auto pt-4">
          <div className="px-2 mb-4">
            <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <User className="mr-4 size-5 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Friends</span>
            </div>
            <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <Inbox className="mr-4 size-5 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Get Nitro</span>
            </div>
            <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <Store className="mr-4 size-5 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Shop</span>
            </div>
          </div>

          {/* DM */}
          <div className="px-2 mb-4">
            <h3 className="text-xs font-semibold text-[#8e9297] px-2 mb-2 uppercase">
              Direct Messages
            </h3>
            <div className="flex items-center px-2 py-1.5 rounded bg-[#393c43] text-white cursor-pointer">
              <Image
                src="/brand-asset-profile-picture.png"
                alt="Pinguins Avatar"
                width={32}
                height={32}
                className="object-cover rounded-full mr-3"
              />
              <span className="font-medium">Pinguins</span>
            </div>

            <div className="my-1 space-y-px">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-2 py-1.5 rounded text-brand-secondary-600 cursor-not-allowed"
                >
                  <div className="size-8 rounded-full bg-discord-background mr-3" />
                  <span className="font-medium text-sm">User {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-2 pb-3 bg-[#292b2f] flex items-center">
          <div className="size-9 rounded-full bg-discord-background mr-3 relative flex items-center justify-center">
            <User className="size-5 relative bottom-0.5 text-white/60" />
            <div className="size-2 rounded-full bg-green-500 absolute z-10 bottom-1 right-0" />
          </div>

          <div className="flex-1">
            <p className="text-xs font-medium text-white">You</p>
            <p className="text-[10px] text-[#b9bbbe] flex items-center">
              Online
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Mic className="size-5 text-[#b9bbbe] hover:text-white cursor-not-allowed" />
            <Headphones className="size-5 text-[#b9bbbe] hover:text-white cursor-not-allowed" />
            <Cog className="size-5 text-[#b9bbbe] hover:text-white cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#36393f] flex items-center px-4 shadow-sm border-b border-[#202225]">
          <div className="md:hidden mr-4 ">
            <MenuIcon className="size-6 text-[#b9bbbe] hover:text-white cursor-pointer" />
          </div>

          <div className="flex items-center">
            <div className="relative">
              <Image
                src="/brand-asset-profile-picture.png"
                alt="Pinguins Avatar"
                width={40}
                height={40}
                className="object-cover rounded-full mr-3"
              />
              <div className="absolute bottom-0 right-3 size-3 bg-green-500 rounded-full border-2 border-[#36393f] " />
            </div>

            <p className="font-semibold text-white">Pinguins</p>
          </div>

          <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
            <Phone className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Video className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Pin className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <UserCircle className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Search className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <Inbox className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            <HelpCircle className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 bg-discord-background flex flex-col-reverse">
          {children}
        </div>

        {/* Message Input */}
        <div className="p-4">
          <div className="flex items-center bg-[#40444b] rounded-lg p-1">
            <PlusCircle className="mx-3 text-[#b9bbbe] hover:text-white cursor-not-allowed" />
            <input
              type="text"
              readOnly
              placeholder="Message @Pinguins"
              className="flex-1 bg-transparent py-2.5 px-1 text-white placeholder-[#72767d] focus:outline-noe cursor-not-allowed"
            />
            <div className="flex items-center space-x-3 mx-3 text-[#b9bbbe]">
              <Gift className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
              <Sticker className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
              <Smile className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
