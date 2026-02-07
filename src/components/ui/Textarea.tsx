"use client";

import React, { forwardRef, ReactNode, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  message?: string | ReactNode;
  messageType?: "error" | "success" | "warning" | "info";
  helperText?: string;
  maxCharacters?: number;
  containerClassName?: string;
  labelClassName?: string;
  error?: string;
}

const getMessageStyles = (type?: string) => {
  switch (type) {
    case "error":
      return "text-red-500 dark:text-red-400";
    case "success":
      return "text-green-500 dark:text-green-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "info":
      return "text-blue-500 dark:text-blue-400";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
};

const getInputBorderStyles = (hasError: boolean) => {
  if (hasError) {
    return "border-red-500 dark:border-red-500 focus:ring-red-300 dark:focus:ring-red-700";
  }
  return "border-gh-border focus:ring-gh-hover";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      message,
      messageType = "error",
      helperText,
      maxCharacters,
      containerClassName = "",
      labelClassName = "",
      className = "",
      disabled = false,
      error,
      value = "",
      onChange,
      ...rest
    },
    ref,
  ) => {
    const hasError = (message && messageType === "error") || !!error;
    const charCount = String(value).length;
    const isNearLimit = maxCharacters && charCount > maxCharacters * 0.8;
    const isOverLimit = maxCharacters && charCount > maxCharacters;

    const textareaClasses = `
      w-full
      px-3 py-2
      bg-gh-bg
      border
      rounded-md
      text-gh-text placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2
      resize-none
      ${getInputBorderStyles(!!hasError || !!isOverLimit)}
      ${disabled ? "text-gray-400 cursor-not-allowed opacity-60" : ""}
      ${isOverLimit ? "border-red-500 dark:border-red-500 focus:ring-red-300" : ""}
      ${className}
    `.trim();

    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              className={`block text-sm font-medium text-gh-text ${labelClassName}`}
            >
              {label}
            </label>
          )}
          {maxCharacters && (
            <span
              className={`text-xs ${
                isOverLimit
                  ? "text-red-500 dark:text-red-400 font-medium"
                  : isNearLimit
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {charCount}/{maxCharacters}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...rest}
        />

        {(message || helperText || error) && (
          <div
            className={`text-xs ${getMessageStyles(message || error ? messageType : "info")}`}
          >
            {message || error || helperText}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
