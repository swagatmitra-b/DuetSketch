"use client";

import { MouseEvent } from "react";

const Leave = ({ leaveRoom, id }: { leaveRoom: () => void; id: string }) => {
  const copyID = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    navigator.clipboard.writeText(id);
    button.innerText = "Copied!";
    setTimeout(() => (button.innerText = "Share RoomID"), 1500);
  };
  return (
    <div className="absolute bottom-2 right-3 bg-white flex gap-2 rounded-md">
      <button className="p-2 rounded-md" onClick={copyID}>
        Share RoomID
      </button>
      <button onClick={leaveRoom} className="p-2 rounded-md">
        Leave
      </button>
    </div>
  );
};

export default Leave;
