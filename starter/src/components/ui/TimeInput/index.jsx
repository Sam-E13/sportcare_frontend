// src/components/ui/TimeInput.jsx
import PropTypes from 'prop-types';

export const TimeInput = ({ value, onChange, label, required }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        type="time"
        value={value || ''}
        onChange={handleChange}
        className="h-8 rounded border border-gray-300 px-2 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700"
        required={required}
      />
    </div>
  );
};

TimeInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
};