"use client";

import { useRoom } from "@/userstore";
import Draggable from "react-draggable";

const Room = ({ name }: { name: string }) => {
  const { members, status } = useRoom((state) => state);
  return (
    <Draggable>
      <div className="absolute top-3 right-3 flex flex-col gap-2 border-2 border-black rounded-md p-6 bg-white text-center">
        <h2 className="text-xl">Members</h2>
        <div className="text-center">
          {members.map((mem, i) => (
            <div className="text-lg flex" key={i}>
              <span className="text-2xl mr-1">
                {status.includes(mem) ? "✍️" : "😼"}
              </span>
              <span className="mt-1">
                {mem} {mem == name ? "(you)" : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default Room;
