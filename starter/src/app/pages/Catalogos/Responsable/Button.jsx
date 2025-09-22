import PropTypes from 'prop-types';
import clsx from 'clsx';

export function Button({ 
  children, 
  className, 
  onClick, 
  disabled, 
  type = 'button',
  ...props 
}) {
  return (
    <button
      type={type}
      className={clsx(
        'rounded-lg px-4 py-2 font-medium transition-colors',
        'bg-primary-500 text-white hover:bg-primary-600',
        'dark:bg-primary-600 dark:hover:bg-primary-700',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};