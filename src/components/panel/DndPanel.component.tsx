import React from "react";
import { AiFillSave } from "react-icons/ai";
import NodeComponent from "../common/node/Node.component";
import NodeSkeletonComponent from "../common/skeletons/NodeSkeleton.component";
import AddNodeComponent from "./AddNode.component";
// import { DndConstraints } from "../../constraints/panel.constraints";
// import CardWithIconComponent from "./CardWithIcon.component";
// import { ShapeTypes } from "../../constraints/shapes.contrants";
// import AddShapesComponent from "../shapes/AddShapes.component";

function DndPanelComponent({ saveFile }: { saveFile: () => void }) {
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData("type", nodeType);
    event.dataTransfer.setData("data", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="relative bg-[#33383a] shadow-none h-full flex gap-2 flex-col py-2 border-[#eee] border-2 px-4 text-white">
      {/* {DndConstraints.map((item, index) => (
        <CardWithIconComponent
          className={item.className}
          icon={item.icon}
          description={item.description}
          title={item.title}
          key={index}
          type={item.type}
          func={onDragStart}
        />
      ))} */}
      <h1 className="opacity-50">Components</h1>
      <AddNodeComponent func={onDragStart} />

      <button
        className="bg-green-500 rounded-full text-white absolute inset-x-0 bottom-2 left-2 w-fit p-3 cursor-pointer"
        onClick={() => saveFile()}
      >
        <AiFillSave className="h-6 w-6" />
      </button>
    </div>
  );
}

export default DndPanelComponent;
