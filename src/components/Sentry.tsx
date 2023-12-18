"use client";

import { useRoom } from "@/userstore";

const Sentry = ({ message, show }: { message: string; show: boolean }) => {
  const mode = useRoom((state) => state.mode);
  return (
    <div className="absolute top-2">
      <p
        className={`text-lg ${
          show
            ? "ease-in duration-150 opacity-1"
            : "ease-out duration-150 opacity-0"
        } ${mode ? "text-white" : ""}`}
      >
        {message}
      </p>
    </div>
  );
};

export default Sentry;
