import { dir } from "console";
import React, { ReactNode, useEffect } from "react";
import { Store } from "react-notifications-component";

interface Props {
  children: ReactNode;
}

const ErrorPromiseBoundary = (props: Props) => {
  const { children } = props;

  const handlePromiseRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    const error = event.reason as Error;
    // You can customize the error handling here, such as logging or displaying an alert.
    console.error(error);
    Store.addNotification({
      title: "Error",
      message: error.toString(),
      type: "danger",
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  };

  useEffect(() => {
    const handleRejection = (event: Event) => {
      if (event instanceof PromiseRejectionEvent) {
        handlePromiseRejection(event);
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return children;
};

export default ErrorPromiseBoundary;
