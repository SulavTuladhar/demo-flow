import {
  getOutgoers,
  Handle,
  HandleType,
  Position,
  useReactFlow,
} from "@xyflow/react";
import React, { useMemo, useState } from "react";
import { MdDelete, MdEdit, MdOutlineMoreVert } from "react-icons/md";
import NodeEditModal from "../modal/NodeEdit.modal";
import TableModal from "../modal/Table.modal";
import { uid } from "uid";

function NodeComponent({ id, data }) {
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [tableModal, setTableModal] = useState<boolean>(false);
  const { setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const currentNode = getNode(id);
  const targetId = useMemo(() => `${uid(3)}`, []);
  const sourceId = useMemo(() => `${uid(3)}`, []);
  const outgoers = getOutgoers(currentNode as any, getNodes(), getEdges());
  const previousData = useMemo(() => {
    return {
      title: data?.title,
      description: data?.description,
      color: data?.color ?? "#dbdede",
      outgoers: outgoers,
      hasSideNodes: data?.hasSideNodes,
    };
  }, [data]);

  const closeModal = () => setIsModalOpen(false);
  const closeTableModal = () => setTableModal(false);
  const onSave = (data) => {
    setNodes((prevNodes) => {
      const updatedNode = prevNodes.map((node) =>
        node.id === id ? { ...node, data: data } : node
      );
      return updatedNode;
    });
    closeModal();
  };
  const onDelete = () => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };
  const onConnectedNodeDelete = (id) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };
  const isTrueData = useMemo(
    () => previousData.title && previousData.description,
    [previousData]
  );

  return (
    <div
      className={`relative text-white p-2 rounded-xl`}
      style={{ backgroundColor: previousData?.color }}
    >
      {/* Edit/Add Modal*/}
      <NodeEditModal
        id={id}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        title="Edit"
        data={previousData}
        saveFunc={onSave}
        onConnectedNodeDelete={onConnectedNodeDelete}
      />

      {/* Data Modal */}
      <TableModal
        title="test"
        isModalOpen={tableModal}
        closeModal={closeTableModal}
      />
      {/* More option  */}
      {isMoreOpen && (
        <div className="text-[10px] flex flex-col gap-1 absolute top-[-4rem] right-2 bg-white p-2 rounded-lg shadow text-black ">
          <div
            className="flex items-center gap-1 hover:text-green-400 hover:cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
              setIsMoreOpen(false);
            }}
          >
            {isTrueData ? (
              <>
                <span className="p-1 bg-white rounded-full">
                  <MdEdit />
                </span>
                Edit
              </>
            ) : (
              <>
                <span className="p-1 bg-white rounded-full">
                  <MdEdit />
                </span>
                Add
              </>
            )}
          </div>
          <hr />
          <div
            className="flex items-center gap-1 hover:text-green-400 hover:cursor-pointer"
            onClick={onDelete}
          >
            <span className="p-1 bg-white rounded-full">
              <MdDelete />
            </span>
            Delete
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-2 pl-2">
        {previousData?.title ? (
          <p className="text-xs">{data?.title}</p>
        ) : (
          <span className="text-xs bg-[#f3f3f3] h-4 w-20 rounded-sm"></span>
        )}
        <button onClick={() => setIsMoreOpen(!isMoreOpen)}>
          <MdOutlineMoreVert />
        </button>
      </div>
      <div
        className="bg-white text-black p-4 rounded-xl w-[12rem] cursor-pointer"
        onClick={() => setTableModal(true)}
      >
        {previousData.description ? (
          <h1>{data?.description}</h1>
        ) : (
          <div className="text-xs bg-[#f3f3f3] h-6 w-28 rounded-sm"></div>
        )}
      </div>
      <CustomHandle
        type={"target"}
        color={previousData?.color}
        isData={isTrueData}
        position={Position.Top}
        connectedNodes={outgoers.length}
      />
      <CustomHandle
        type={"source"}
        color={previousData?.color}
        isData={isTrueData}
        position={Position.Bottom}
      />
      {previousData?.hasSideNodes && (
        <>
          <Handle
            type={"target"}
            position={Position.Left}
            isConnectable={false}
          />
          <Handle
            type={"source"}
            position={Position.Right}
            isConnectable={false}
          />
        </>
      )}
    </div>
  );
}

function CustomHandle({
  type,
  color,
  isData,
  position,
  connectedNodes,
}: {
  type: HandleType;
  color: string;
  isData: boolean;
  position: Position;
  connectedNodes?: number;
}) {
  const handlePos = useMemo(() => {
    switch (position) {
      case Position.Top:
        return { bottom: "-5px" };
      case Position.Bottom:
        return { top: "-3px" };
      default:
        return {};
    }
  }, [position]);
  const targetId = useMemo(() => `uid(3)`, []);
  const sourceId = useMemo(() => `uid(3)`, []);
  return (
    <div
      className="absolute flex h-[10px] items-center justify-between px-1 w-[1.6rem] bg-white border-2 rounded-full left-1/2 transform -translate-x-1/2"
      style={handlePos}
    >
      <div className="bg-white relative">
        <Handle
          type={type}
          id={type === "source" ? sourceId : targetId}
          position={position}
          className={`bg-${color} border `}
        />
      </div>
      {connectedNodes ? (
        <p className="text-[5px] z-[10] text-red-500">{connectedNodes}</p>
      ) : null}
    </div>
  );
}

export default NodeComponent;
