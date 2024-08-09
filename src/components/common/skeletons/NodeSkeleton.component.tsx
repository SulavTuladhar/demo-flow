import React from "react";

function NodeSkeletonComponent() {
  return (
    <div className={`relative bg-[#dbdede] p-2 rounded-xl w-[13rem]`}>
      <div className="flex items-center justify-between py-1 pl-2">
        <span className="text-xs bg-[#f3f3f3] h-4 w-20 rounded-sm"></span>
      </div>
      <div className="bg-white p-4 rounded-xl w-[12rem]">
        <div className="text-xs bg-[#f3f3f3] h-6 w-28 rounded-sm"></div>
      </div>
    </div>
  );
}

export default NodeSkeletonComponent;
