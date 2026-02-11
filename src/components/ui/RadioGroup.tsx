"use client";

import React, { ReactNode } from "react";

interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  label?: string;
  description?: string;
  containerClassName?: string;
}

export const RadioGroup = React.forwardRef<
  HTMLFieldSetElement,
  RadioGroupProps
>(
  (
    {
      name,
      value,
      onChange,
      children,
      label,
      description,
      containerClassName = "",
    },
    ref,
  ) => {
    // Injetar props no children
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        return React.cloneElement(element, {
          name,
          checked: element.props.value === value,
          onChange,
        });
      }
      return child;
    });

    return (
      <fieldset ref={ref} className={`space-y-0 ${containerClassName}`}>
        {(label || description) && (
          <legend className="mb-4">
            {label && (
              <h3 className="text-sm font-medium text-gh-text">{label}</h3>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </legend>
        )}
        <div className="space-y-0 border-b border-gray-200 dark:border-gray-700">
          {childrenWithProps}
        </div>
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
