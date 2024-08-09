import React from "react";
import NodeSkeletonComponent from "../common/skeletons/NodeSkeleton.component";
import NodeComponent from "../common/node/Node.component";
import { useDragImage } from "../../hooks.ts/useDrag.hook";

function AddNodeComponent({ func }) {
  const dragImageRef = useDragImage(<NodeSkeletonComponent />);
  const onDragStart = (e) => {
    func(e, "node", {});
    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 50, 50);
    }
  };
  return (
    <div onDragStart={(e) => onDragStart(e)} draggable>
      <NodeSkeletonComponent />
    </div>
  );
}

export default AddNodeComponent;
