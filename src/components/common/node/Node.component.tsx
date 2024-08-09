import { Handle, HandleType, Position, useReactFlow } from "@xyflow/react";
import React, { useMemo, useState } from "react";
import { MdDelete, MdEdit, MdOutlineMoreVert } from "react-icons/md";
import NodeEditModal from "../modal/NodeEdit.modal";

function NodeComponent({ id, data }) {
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setNodes } = useReactFlow();

  const previousData = useMemo(() => {
    return {
      title: data?.title,
      description: data?.description,
      color: data?.color ?? "#dbdede",
    };
  }, [data]);

  const closeModal = () => setIsModalOpen(false);

  const onSave = (data) => {
    setNodes((prevNodes) => {
      const nodeToUpdate = prevNodes.find((node) => node.id === id);
      if (!nodeToUpdate) return prevNodes;
      const updatedNode = {
        ...nodeToUpdate,
        data,
      };
      return prevNodes.map((node) => (node.id === id ? updatedNode : node));
    });
    closeModal();
  };
  const onDelete = () => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };

  const isTrueData = useMemo(() => {
    return previousData.title && previousData.description;
  }, [previousData]);

  return (
    <div
      className={`relative text-white p-2 rounded-xl`}
      style={{ backgroundColor: previousData?.color }}
    >
      {/* Modal */}
      <NodeEditModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        title="Edit"
        data={previousData}
        saveFunc={onSave}
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
          <p className="text-xs">Total Shipment</p>
        ) : (
          <span className="text-xs bg-[#f3f3f3] h-4 w-20 rounded-sm"></span>
        )}
        <button onClick={() => setIsMoreOpen(!isMoreOpen)}>
          <MdOutlineMoreVert />
        </button>
      </div>
      <div className="bg-white text-black p-4 rounded-xl w-[12rem]">
        {previousData.description ? (
          <h1>9999</h1>
        ) : (
          <div className="text-xs bg-[#f3f3f3] h-6 w-28 rounded-sm"></div>
        )}
      </div>
      <CustomHandle
        type={"source"}
        color={previousData?.color}
        isData={isTrueData}
      />
      <CustomHandle
        type={"target"}
        color={previousData?.color}
        isData={isTrueData}
      />
    </div>
  );
}

function CustomHandle({
  type,
  color,
  isData,
}: {
  type: HandleType;
  color: string;
  isData: boolean;
}) {
  const handlePosition = useMemo(
    () => (type === "source" ? { bottom: "-5px" } : { top: "-3px" }),
    [type]
  );
  return (
    <div
      className="absolute flex items-center justify-between px-1 w-[1.6rem] bg-white border-2 rounded-full left-1/2 transform -translate-x-1/2"
      style={handlePosition}
    >
      <div className="bg-white relative">
        <Handle
          type={type}
          position={type === "source" ? Position.Bottom : Position.Top}
          className={`bg-${color} border absolute`}
        />
      </div>
      <p className="text-[5px]">3</p>
    </div>
  );
}

export default NodeComponent;
