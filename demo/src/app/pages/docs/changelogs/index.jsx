// Import Dependencies
import dayjs from "dayjs";
import parse from "html-react-parser";

// Local Imports
import { Page } from "components/shared/Page";
import { Toc } from "components/template/Toc";

// ----------------------------------------------------------------------

const releases = [
  {
    v: "1.0.0",
    date: "02.03.2025",
    changes: ["Initial Release"],
  },
  {
    v: "1.0.1",
    date: "02.04.2025",
    changes: ["Fix Zed browser issue"],
  },
  {
    v: "1.0.3",
    date: "02.10.2025",
    changes: ["Fix Firefox RTL langs issue (Update /src/app/contexts/locale/Provider.jsx file)"],
  },
  {
    v: "1.1.0",
    date: "03.12.2025",
    changes: ["Add Gradient Circlebar and Progress"],
  },
];

export default function Changelogs() {
  return (
    <Page title="Changelogs">
      <div className="transition-content grid grid-cols-4 gap-8 px-[--margin-x] pb-16 pt-5 lg:pt-6 2xl:gap-16">
        <div className="col-span-4 space-y-8 lg:col-span-3" id="changelog-root">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl 2xl:text-3xl">
              Changelogs
            </h1>
          </div>
          <div className="mx-auto max-w-4xl">
            {releases.map((item) => (
              <section key={item.v}>
                <h3
                  id={item.v}
                  className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
                  data-heading={`Version ${item.v}`}
                  data-order="2"
                >
                  <a href="#icons" className="text-gray-800 dark:text-dark-50">
                    Version {item.v}
                  </a>
                </h3>

                <div className="mt-2">
                  <time className="text-base">
                    {dayjs(item.date).format("DD MMMM, YYYY")}
                  </time>
                </div>

                <ul className="mt-4 list-inside list-disc space-y-1.5 text-base">
                  {item.changes.map((item, i) => (
                    <li key={i}>{parse(item)}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <Toc wrapperSelector="#changelog-root" />
      </div>
    </Page>
  );
}
