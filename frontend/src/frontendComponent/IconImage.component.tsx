import React from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

function IconImage(props: Props) {
  const { src, alt, className } = props;

  return (
    <img src={src} alt={alt} className={className} />
  );
}

IconImage.defaultProps = {
  className: "",
};

export default IconImage;
