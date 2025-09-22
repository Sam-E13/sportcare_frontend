import clsx from "clsx";

import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";
import { Button, Card } from "components/ui";
import { useToggle } from "hooks";
import { setThisClass } from "utils/setThisClass";

export function Customization() {
  return (
    <section>
      <h3
        id="customization"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Customization"
        data-order="2"
      >
        <a href="#customization">Customization</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm+">
        <p>
          Tailux has modular architecture that allows you to customize various
          configuration, including: theme, app, colors, layout, and more.
        </p>
        <p className="inline-code">
          For customizing colors and theme and app constants refer to{" "}
          <code>src/constants</code> and <code>src/configs</code>
        </p>
        <div className="text-sm">
          <SyntaxHighlighter language="js">
            {`import twColors from "tailwindcss/colors";

const colors = {
    gray: {
        ...twColors.gray,
        150: "#EBEDF0",
    },
    slate: {
        ...twColors.slate,
        150: "#E9EEF5",
    },
    neutral: {
        ...twColors.neutral,
        150: "#EDEDED",
    },
    navy: {
        50: "#E7E9EF",
        100: "#C2C9D6",
        200: "#A5AFC4",
        300: "#6D7EA1",
        400: "#5C6B8A",
        450: "#465675",
        500: "#384766",
        600: "#313E59",
        700: "#24314A",
        750: "#222E45",
        800: "#202B40",
        900: "#182030",
    },
    mirage: {
        50: "#DDE5F5",
        100: "#B4BFD9",
        200: "#9EAAC4",
        300: "#6C7C9E",
        400: "#3D4E70",
        450: "#293859",
        500: "#1E2B47",
        600: "#1A2640",
        700: "#101A2E",
        750: "#0F1729",
        800: "#0C1221",
        900: "#050A16",
    },
    black: {
        50: "#EBEBED",
        100: "#D9D9DE",
        200: "#C5C5CC",
        300: "#93939C",
        400: "#4A4A4F",
        450: "#333338",
        500: "#242428",
        600: "#1F1F21",
        700: "#131314",
        750: "#0C0C0D",
        800: "#080809",
        900: "#000000",
    },
    mint: {
        50: "#E1E5EA",
        100: "#C5CCD3",
        200: "#A0ABB6",
        300: "#70838F",
        400: "#506877",
        450: "#384954",
        500: "#2A3942",
        600: "#242F38",
        700: "#152129",
        750: "#111B22",
        800: "#0D161C",
        900: "#0A1014",
    },
    cinder: {
        50: "#E6E7EB",
        100: "#D0D2DB",
        200: "#B7BAC4",
        300: "#838794",
        400: "#4C4F57",
        450: "#383A41",
        500: "#2A2C32",
        600: "#232429",
        700: "#1C1D21",
        750: "#1A1B1F",
        800: "#15161A",
        900: "#0E0F11",
    },
    indigo: twColors.indigo,
    blue: twColors.blue,
    green: twColors.green,
    amber: twColors.amber,
    purple: twColors.purple,
    rose: twColors.rose,
    variants: {
        "secondary-lighter": "#FF75DF",
        "secondary-light": "#FF2ECF",
        secondary: "#E000AD",
        "secondary-darker": "#B8008C",
        "info-lighter": twColors.sky["400"],
        "info-light": twColors.sky["500"],
        info: twColors.sky["600"],
        "info-darker": twColors.sky["700"],
        "success-lighter": twColors.emerald["400"],
        "success-light": twColors.emerald["500"],
        success: twColors.emerald["600"],
        "success-darker": twColors.emerald["700"],
        "warning-lighter": "#FFBA42",
        "warning-light": "#FFA71A",
        warning: "#F59200",
        "warning-darker": "#DB7C00",
        "error-lighter": "#FF8A5C",
        "error-light": "#FF6933",
        error: "#FF4F1A",
        "error-darker": "#E52E00",
    },
};

export { twColors, colors };`}
          </SyntaxHighlighter>
        </div>
        <div className="inline-code">
          The <code>this</code> class is used to reference the current color.
          For example, <code>this:primary</code> sets the <code>this</code>{" "}
          color as the primary color. This can then be used for styling with
          Tailwind CSS, such as <code>bg-this dark:bg-this-darker</code>
        </div>
        <Card className="p-4">
          <ThisExample />
        </Card>
        <div className="text-sm">
          <SyntaxHighlighter language="jsx">
            {`import { Button } from "components/ui";
import { useToggle } from "hooks";
import { setThisClass } from "utils/setThisClass";

function ThisExample() {
  const [value, toggle] = useToggle([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]);

  return (
    <div>
      <div
        className={clsx(
          setThisClass(value),
          "size-16 rounded-lg bg-this dark:bg-this-light",
        )}
      />

      <Button className="mt-4" onClick={toggle}>
        Toggle
      </Button>
    </div>
  );
}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}

function ThisExample() {
  const [value, toggle] = useToggle([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]);

  return (
    <div>
      <div
        className={clsx(
          setThisClass(value),
          "size-16 rounded-lg bg-this dark:bg-this-light",
        )}
      />

      <Button className="mt-4" onClick={toggle}>
        Toggle
      </Button>
    </div>
  );
}
