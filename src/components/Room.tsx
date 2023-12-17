"use client";

import { useRoom } from "@/userstore";
import Draggable from "react-draggable";

const Room = ({ name }: { name: string }) => {
  const members = useRoom((state) => state.members);
  return (
    <Draggable>
      <div className="absolute top-3 right-3 flex flex-col gap-2 border-2 border-black rounded-md p-4 bg-white text-center">
        <h2 className="text-xl">Members</h2>
        <div className="text-center">
          {members.map((mem, i) => (
            <div className="text-lg" key={i}>
              {mem} {mem == name ? "(you)" : null}
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default Room;
