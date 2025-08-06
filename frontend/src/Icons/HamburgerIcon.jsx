import React from "react";

export default function HamburgerIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect y="4" width="24" height="2.5" rx="1.25" fill="#6B7280" />
      <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#6B7280" />
      <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#6B7280" />
    </svg>
  );
} 