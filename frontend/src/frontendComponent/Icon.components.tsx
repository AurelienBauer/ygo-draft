import React from "react";

interface Props {
  icon: string;
  scale?: string;
  strokeWidth?: string;
  strokeColor?: string;
}

function Icon(props: Props) {
  const {
    icon, scale, strokeColor, strokeWidth,
  } = props;
  let id = null;
  let path = null;
  let fill = "none";
  switch (icon) {
    case "arrow-right":
      id = "i-arrow-right";
      path = <path d="M22 6 L30 16 22 26 M30 16 L2 16" />;
      break;
    case "arrow-left":
      id = "i-arrow-left";
      path = <path d="M10 6 L2 16 10 26 M2 16 L30 16" />;
      break;
    case "user-filled":
      id = "i-user";
      path = (
        <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
      );
      fill = strokeColor || "none";
      break;
    case "user":
      id = "i-user";
      path = (
        <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
      );
      break;
    case "signout":
      id = "i-signout";
      path = <path d="M28 16 L8 16 M20 8 L28 16 20 24 M11 28 L3 28 3 4 11 4" />;
      break;
    case "search":
      id = "i-search";
      path = (
        <>
          <circle cx="14" cy="14" r="12" />
          <path d="M23 23 L30 30" />
        </>
      );
      break;
    case "import":
      id = "i-import";
      path = (
        <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16" />
      );
      break;
    default:
      id = "i-undefined";
      path = (
        <>
          <circle cx="14" cy="14" r="12" />
          <path d="M23 23 L30 30" />
        </>
      );
  }

  return (
    id
    && path && (
      <svg
        id={id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill={fill}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        transform={`scale(${scale})`}
      >
        {path}
      </svg>
    )
  );
}

Icon.defaultProps = {
  scale: "1",
  strokeColor: "currentcolor",
  strokeWidth: "2",
};

export default Icon;
