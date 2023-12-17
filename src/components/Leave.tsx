"use client";

const Leave = ({ leaveRoom }: { leaveRoom: () => void }) => {
  return (
    <div className="absolute bottom-2 right-3">
      <button onClick={leaveRoom} className="border-2 border-black p-2 rounded-md">
        Leave
      </button>
    </div>
  );
};

export default Leave;
