// Import Dependencies
import { ArrowUpIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar } from "components/ui";
import { ChannelCard } from "./ChannelCard";

// ----------------------------------------------------------------------

const channels = [
  {
    uid: "1",
    logo: "/images/100x100.png",
    name: "Instagram",
    username: "@theapp721",
    impression: "+2",
  },
  {
    uid: "2",
    logo: "/images/100x100.png",
    name: "Facebook",
    username: "@theapp721",
    impression: "+3",
  },
  {
    uid: "3",
    logo: "/images/100x100.png",
    name: "Tik Tok",
    username: "@ticktocco",
    impression: "+1",
  },
  {
    uid: "4",
    logo: "/images/100x100.png",
    name: "Twitter",
    username: "@twaccount",
    impression: "+5",
  },
  {
    uid: "5",
    logo: "/images/100x100.png",
    name: "Pinterest",
    username: "@pinstudio",
    impression: "+1",
  },
  {
    uid: "6",
    logo: "/images/100x100.png",
    name: "Discord",
    username: "@serverdiscord",
    impression: "+3",
  },
  {
    uid: "7",
    logo: "/images/100x100.png",
    name: "Youtube",
    username: "@channelyou",
    impression: "+2",
  },
  {
    uid: "8",
    logo: "/images/100x100.png",
    name: "Tumblr",
    username: "@tum532",
    impression: "+1",
  },
];

export function Channels() {
  return (
    <div className="flex flex-col rounded-xl bg-info/10 py-5 dark:bg-dark-800 lg:flex-row">
      <div className="flex min-w-0 flex-col px-4 sm:px-5 lg:w-48 lg:shrink-0 lg:py-3">
        <h3 className="truncate text-base font-medium tracking-wide text-gray-700 dark:text-gray-100 lg:text-lg">
          Channels
        </h3>
        <p className="mt-3 grow">
          Channels analytics calculated based on your activity
        </p>
        <div className="mt-3 flex items-center space-x-2 rtl:space-x-reverse">
          <Avatar size={7} initialColor="success" initialVariant="soft">
            <ArrowUpIcon className="size-4" />
          </Avatar>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            3.3%
          </p>
        </div>
      </div>

      <div className="hide-scrollbar mt-5 flex space-x-4 overflow-x-auto px-4 sm:px-5 lg:mt-0 lg:pl-0 rtl:space-x-reverse">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.uid}
            logo={channel.logo}
            name={channel.name}
            username={channel.username}
            impression={channel.impression}
          />
        ))}
      </div>
    </div>
  );
}
