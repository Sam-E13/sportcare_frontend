// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  Label,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { Input, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function LabelsField({ onChange, value, name }) {
  const [query, setQuery] = useState("");



  const removeItem = (id) => {
    const newValue = value.filter((item) => item.id !== id);
    onChange(newValue);
  };

  return (
    <Combobox
      value={value || null}
      onChange={onChange}
      name={name}
      by={(a, b) => a?.id === b?.id}
      multiple
      immediate
    >
      {({ open }) => (
        <div className="relative">
          <Label>Labels:</Label>

          <div
            className={clsx(
              "relative mt-1.5 rounded-lg border transition-colors",
              open
                ? "border-primary-600 dark:border-primary-500"
                : "border-gray-300 hover:border-gray-400 dark:border-dark-450 dark:hover:border-dark-400",
            )}
          >
            <ul
              className={clsx(
                "flex flex-wrap gap-1.5 border-b px-3 py-2 transition-colors",
                open
                  ? "border-primary-600 dark:border-primary-500"
                  : "border-gray-300 dark:border-dark-450",
              )}
            >
              {value.length > 0 ? (
                value.map((label) => (
                  <li key={label.id}>
                    <Tag
                      onClick={() => removeItem(label.id)}
                      component="button"
                      type="button"
                      color={label.color}
                      variant="soft"
                    >
                      {label.text}
                    </Tag>
                  </li>
                ))
              ) : (
                <span className="h-6 italic text-gray-400 dark:text-dark-300">
                  Not Selected Labels
                </span>
              )}
            </ul>

            <div className="relative w-full cursor-default overflow-hidden px-3 py-2 text-start outline-none ltr:pr-9 rtl:pl-9">
              <ComboboxInput
                as={Input}
                unstyled
                classNames={{
                  root: "flex-1",
                  input:
                    "placeholder:text-gray-400 dark:placeholder:text-dark-300",
                }}
                displayValue={(label) => label.text}
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                value={query}
                placeholder="Select Labels"
              />
              <ComboboxButton className="absolute inset-y-0 flex items-center ltr:right-0 ltr:pr-2 rtl:left-0 rtl:pl-2">
                <ChevronDownIcon
                  className={clsx(
                    "size-5 text-gray-400 transition-transform dark:text-dark-300",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>

            <Transition
              as={ComboboxOptions}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none"
            >
            
            </Transition>
          </div>
        </div>
      )}
    </Combobox>
  );
}

LabelsField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  name: PropTypes.string,
};
