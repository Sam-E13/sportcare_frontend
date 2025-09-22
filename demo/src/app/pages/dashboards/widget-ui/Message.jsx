// Local Imports
import CreativeSVG from "assets/illustrations/creativedesign-char.svg?react";
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Message() {
  return (
    <Card className="flex flex-row gap-x-4 p-3">
      <div className="w-12 shrink-0">
        <CreativeSVG className="w-full" />
      </div>
      <div>
        <p className="text-sm+ font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Design Updated
        </p>
        <p className="mt-2 text-xs+">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
        <div className="mt-3 flex flex-wrap -space-x-2 rtl:space-x-reverse">
          <Avatar
            size={7}
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl ring ring-white dark:ring-dark-700",
            }}
            src="/images/200x200.png"
          />

          <Avatar
            size={7}
            className=""
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl text-xs+ ring ring-white dark:ring-dark-700",
            }}
            name="John Doe"
            initialColor="info"
          />

          <Avatar
            size={7}
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl text-xs+ ring ring-white dark:ring-dark-700",
            }}
            src="/images/200x200.png"
          />
        </div>
      </div>
    </Card>
  );
}
