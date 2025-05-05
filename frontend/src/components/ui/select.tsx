import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Add any additional props here if needed
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return (
    <select
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800 dark:focus-visible:ring-blue-500"
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = 'Select';

export { Select };
