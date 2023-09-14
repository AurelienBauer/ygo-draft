import React from "react";

type Icons = "arrow-right" | "arrow-left" | "user-filled" | "user" | "signout" | "search" | "import" | "star" | "bookmark" | "reload" | "chevron-bottom" | "ygo-deck";

interface Props {
  icon: Icons;
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
    case "star":
      id = "i-star";
      path = (
        <path d="M16 2 L20 12 30 12 22 19 25 30 16 23 7 30 10 19 2 12 12 12 Z" />
      );
      break;
    case "bookmark":
      id = "i-bookmark";
      path = (
        <path d="M6 2 L26 2 26 30 16 20 6 30 Z" />
      );
      break;
    case "reload":
      id = "i-reload";
      path = (
        <path d="M29 16 C29 22 24 29 16 29 8 29 3 22 3 16 3 10 8 3 16 3 21 3 25 6 27 9 M20 10 L27 9 28 2" />
      );
      break;
    case "chevron-bottom":
      id = "i-chevron-bottom";
      path = (
        <path d="M30 12 L16 24 2 12" />
      );
      break;
    case "ygo-deck":
      id = "i-ygo-deck";
      path = (
        <>
          <rect x="5.418" y="36.181" width="20.524" height="6.359" transform="matrix(0.999967, 0.008139, -1.005924, 0.991846, 94.172005, 44.533161)" />
          <rect x="56.792" y="86.83" width="20.578" height="6.505" />
          <rect x="27.016" y="11.994" width="8.67" height="3.902" transform="matrix(0.68424, -0.729257, -0.120406, 1.589803, 60.407426, 87.605787)" />
        </>
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
