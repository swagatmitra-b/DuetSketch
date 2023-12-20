"use client";

import { useRoom } from "@/userstore";
import Draggable from "react-draggable";
import { MoonLoader } from "react-spinners";

const Room = ({ name, loader }: { name: string; loader: boolean }) => {
  const { members, status } = useRoom((state) => state);
  return (
    <Draggable>
      <div className="absolute top-3 right-3 flex flex-col gap-2 border-2 border-black rounded-md p-6 bg-white text-center">
        <h2 className="text-xl">Members</h2>
        <div className="flex justify-center text-center">
          {loader ? (
            <MoonLoader size={25} speedMultiplier={0.8} />
          ) : (
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
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Room;
