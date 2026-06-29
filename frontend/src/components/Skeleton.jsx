import React from "react";

export const Skeleton = ({ variant = "rect", className = "" }) => {

  const baseClasses = "bg-slate-200 dark:bg-slate-700 animate-pulse";
  const shapes = {
    circle: "rounded-full",
    rect: "rounded-md",
    text: "rounded h-4 w-full"
  };

  return <div className={`${baseClasses} ${shapes[variant]} ${className}`} />;
};