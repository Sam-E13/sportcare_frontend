import { Button } from "components/ui";

const ButtonSize = () => {
  return (
    <div className="inline-space flex flex-wrap items-end">
      <Button className="rounded px-3 py-1 text-xs">Button</Button>
      <Button className="px-4 py-1.5 text-xs+">Button</Button>
      <Button>Button</Button>
      <Button className="px-6 py-3 text-sm+">Button</Button>
      <Button className=" px-8 py-3.5 text-base">Button</Button>
    </div>
  );
};

export { ButtonSize };
