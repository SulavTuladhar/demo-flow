import { Node } from "@xyflow/react";

export const MiniMapNodeColor = (node: Node) => {
  switch (node.type) {
    case "node":
      return "#ef4444";
    case "question":
      return "#facc15";
    case "shape":
      return "#f87171";
    default:
      return "#9ca3af";
  }
};
