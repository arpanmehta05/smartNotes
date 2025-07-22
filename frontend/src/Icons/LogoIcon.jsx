import React from 'react';

const LogoIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    {/* Document Path */}
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
    
    {/* Spark Path - A contrasting color can be applied here if needed */}
    <path
      fill="#FFFFFF" // White spark to contrast with the main color
      d="M13.5 3.5V8H18.5L13.5 3.5Z"
      transform="translate(-2, 2)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 16.5 6"
        to="360 16.5 6"
        dur="10s"
        repeatCount="indefinite"
      />
    </path>

    <path
      fill="#FFFFFF"
      d="M12.5 12.5L13.2929 15.2071L15 16L13.2929 16.7929L12.5 19.5L11.7071 16.7929L10 16L11.7071 15.2071L12.5 12.5Z"
    >
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

export default LogoIcon;
