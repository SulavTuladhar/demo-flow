/* eslint-disable no-unused-vars */
import {
  Background,
  BezierEdge,
  Connection,
  Controls,
  EdgeTypes,
  MarkerType,
  MiniMap,
  NodeTypes,
  OnConnect,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, {
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { uid } from "uid";
import DndPanelComponent from "./panel/DndPanel.component";
import { showSuccess } from "../utils/notify";
import { MiniMapNodeColor } from "../constraints/minimap.constraints";
import CustomEdge from "./CustomEdges";
import NodeComponent from "./common/node/Node.component";

const nodeTypes = {
  node: NodeComponent,
} as NodeTypes;

const edgeTypes = {
  customEdge: CustomEdge,
} as EdgeTypes;

const initialNodes = JSON.parse(localStorage.getItem("nodes") as any) || [];
const initialEdges = JSON.parse(localStorage.getItem("edges") as any) || [];

function ReactFlowContainer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, OnEdgesChange] = useEdgesState(initialEdges);
  const [isFileSaved, setIsFileSaved] = useState<boolean>(false);

  useEffect(() => {
    setIsFileSaved(false);
  }, [nodes, edges]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isFileSaved) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    if (!isFileSaved) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      if (!isFileSaved) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, [isFileSaved]);

  const connectingNodeId = useRef(null);
  const connectingNodeHandle = useRef(null);

  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const saveFile = () => {
    localStorage.setItem("edges", JSON.stringify(edges));
    localStorage.setItem("nodes", JSON.stringify(nodes));
    setIsFileSaved(true);
    showSuccess("Saved");
  };

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      connectingNodeId.current = null;
      connectingNodeHandle.current = null;
      const edge = {
        ...connection,
        // animated: true,
        id: `${uid(3)}`,
        type: "customEdge",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      setEdges((prevEdges: any) => addEdge(edge, prevEdges));
    },
    [setEdges]
  );
  const onPaneClick = (event, nodes) => {
    const menuNode = nodes.find((node) => node.type === "menu");
    if (menuNode && isMenuOpen) {
      setNodes((prevNodes) => {
        return prevNodes.filter((node) => node.id !== menuNode.id);
      });
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("type");
      const data = event.dataTransfer.getData("data");
      if (
        typeof type === "undefined" ||
        !type ||
        !data ||
        typeof data === "undefined"
      ) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${uid(3)}`,
        type,
        data: JSON.parse(data),
        position,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );
  const onConnectStart = useCallback(
    (
      _,
      params: {
        nodeId: string | null;
        handleId: string | null;
        handleType: "source" | "target" | null;
      }
    ) => {
      connectingNodeId.current = params.nodeId as any;
      connectingNodeHandle.current = params.handleId as any;
    },
    []
  );
  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      if (targetIsPane) {
        const id = uid(3);
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {},
          origin: [0.5, 0.0],
          type: "node",
        };

        setNodes((nds) => nds.concat(newNode as any));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            sourceHandle: connectingNodeHandle.current,
            target: id,
            type: "customEdge",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            variant: BezierEdge,
          } as any)
        );
      }
      setIsMenuOpen(false);
    },
    [screenToFlowPosition]
  );

  return (
    <div className="flex h-full">
      <div>
        <DndPanelComponent saveFile={saveFile} />
      </div>
      <div
        className="h-full w-[100vw] border-2"
        ref={reactFlowWrapper}
        onClick={(e) => onPaneClick(e, nodes)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView={true}
          onEdgesChange={OnEdgesChange}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onConnectEnd={onConnectEnd}
          onConnectStart={onConnectStart}
        >
          <Background bgColor="#f9f7f3" />
          <Controls />
          <MiniMap
            zoomable
            pannable
            nodeStrokeColor={(n) => {
              return MiniMapNodeColor(n);
            }}
            nodeColor={(n) => {
              return MiniMapNodeColor(n);
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <ReactFlowContainer />
  </ReactFlowProvider>
);
