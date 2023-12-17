import React from "react";

const Sentry = ({ message }: { message: string }) => {
  return (
    <div className="absolute top-2">
      <p
        className={`text-lg ${
          message
            ? "ease-in duration-100 opacity-1"
            : "ease-out duration-100 opacity-0"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default Sentry;
