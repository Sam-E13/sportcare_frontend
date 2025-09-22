// Import Dependencies
import PropTypes from "prop-types";
import { Label, RadioGroup } from "@headlessui/react";


// ----------------------------------------------------------------------

export function ColorField({ fieldProps }) {
  return (
    <RadioGroup {...fieldProps}>
      <Label>Task Color:</Label>
      <div className="mt-2 flex gap-2 lg:mt-3.5">
        
      </div>
    </RadioGroup>
  );
}

ColorField.propTypes = {
  fieldProps: PropTypes.object,
};
