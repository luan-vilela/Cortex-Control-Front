"use client";

import React from "react";

interface SwitchProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "purple" | "green" | "red";
  containerClassName?: string;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case "sm":
      return "w-8 h-5";
    case "lg":
      return "w-16 h-8";
    case "md":
    default:
      return "w-12 h-6";
  }
};

const getToggleSizeStyles = (size: string) => {
  switch (size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-7 h-7";
    case "md":
    default:
      return "w-5 h-5";
  }
};

const getToggleTranslate = (size: string, checked: boolean) => {
  if (!checked) return "translate-x-0";
  switch (size) {
    case "sm":
      return "translate-x-3";
    case "lg":
      return "translate-x-8";
    case "md":
    default:
      return "translate-x-6";
  }
};

const getColorStyles = (checked: boolean, color: string) => {
  if (!checked) {
    return "bg-gray-300 dark:bg-gray-600";
  }

  switch (color) {
    case "purple":
      return "bg-purple-600 dark:bg-purple-500";
    case "green":
      return "bg-green-600 dark:bg-green-500";
    case "red":
      return "bg-red-600 dark:bg-red-500";
    case "blue":
    default:
      return "bg-blue-600 dark:bg-blue-500";
  }
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      checked = false,
      onChange,
      disabled = false,
      label,
      description,
      size = "md",
      color = "blue",
      containerClassName = "",
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(e.target.checked);
      }
    };

    const sizeStyles = getSizeStyles(size);
    const toggleSizeStyles = getToggleSizeStyles(size);
    const toggleTranslate = getToggleTranslate(size, checked);
    const colorStyles = getColorStyles(checked, color);

    return (
      <div className={`flex items-center gap-3 ${containerClassName}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />

          <label
            htmlFor={id}
            className={`
              inline-flex items-center cursor-pointer
              ${sizeStyles}
              ${colorStyles}
              rounded-full
              transition-colors duration-300
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              relative
            `}
          >
            <span
              className={`
                ${toggleSizeStyles}
                rounded-full
                bg-white dark:bg-gray-900
                shadow-md
                absolute
                transition-transform duration-300
                ${toggleTranslate}
              `}
            />
          </label>
        </div>

        {label && (
          <div className="flex-1">
            <label
              htmlFor={id}
              className="block text-sm font-medium text-gh-text cursor-pointer select-none hover:text-blue-600 transition-colors"
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";
