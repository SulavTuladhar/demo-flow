import { Switch } from "@material-tailwind/react";
import { getOutgoers, useReactFlow } from "@xyflow/react";
import React, { useMemo, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "0",
    left: "auto",
    right: "0",
    bottom: "0",
    marginRight: "0",
    transform: "none",
    width: "15%",
    height: "100%",
  },
};

interface ModalInterface {
  id: string;
  data: any;
  isModalOpen: boolean;
  closeModal: () => void;
  title: string;
  saveFunc: (data) => void;
  onConnectedNodeDelete: any;
}

function NodeEditModal({
  id,
  data,
  isModalOpen,
  closeModal,
  saveFunc,
  onConnectedNodeDelete,
}: ModalInterface) {
  const { getNode, getNodes, getEdges } = useReactFlow();
  const { title, description, color, hasSideNodes } = useMemo(() => {
    return {
      title: data.title,
      description: data.description,
      color: data.color,
      hasSideNodes: data.hasSideNodes,
    };
  }, [data]);
  const [nodeTitle, setNodeTitle] = useState<string>(title ?? "");
  const [nodeDescription, setNodeDescription] = useState<string>(
    description ?? ""
  );
  const [nodeColor, setColor] = useState<string>(color ?? "");
  const [checked, setChecked] = useState(hasSideNodes ?? null);
  const isChildrenNodeRef = useRef<any>(null);
  const currentNode = getNode(id);
  const outgoers = getOutgoers(currentNode as any, getNodes(), getEdges());

  const onSave = (e) => {
    e.preventDefault();
    const sideNodes = isChildrenNodeRef.current.checked;
    const updatedData = {
      title: nodeTitle,
      description: nodeDescription,
      color: nodeColor,
      hasSideNodes: sideNodes,
    };
    saveFunc(updatedData);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex items-center justify-between pb-4">
          <p>{data?.title ? `Edit ${title ?? "Node"}` : `Add Node Detail`}</p>
          <button onClick={() => closeModal()}>X</button>
        </div>
        <hr />
        <div className="flex flex-col gap-8">
          {/* Inputs */}
          <div className="mt-6 flex flex-col gap-2">
            <label className="text-sm">Title</label>
            <input
              type="text"
              value={nodeTitle}
              onChange={(e) => setNodeTitle(e.target.value)}
              className="border p-2 rounded-md mr-2 w-full outline-none bg-[#f5f6fa]"
            />

            <label className="text-sm">Description</label>
            <input
              type="text"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              className="border p-2 rounded-md mr-2 w-full outline-none bg-[#f5f6fa]"
            />
            <p className="text-sm">Has Side Handles </p>
            <Switch
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
              inputRef={isChildrenNodeRef}
              checked={checked}
              onChange={setChecked}
            />
          </div>
          <hr />
          {/* Node Detail */}
          <div className="text-sm">
            <p className="py-2">Customize Node</p>

            <div className="flex items-center justify-between">
              <label>Color</label>
              <input
                type="color"
                value={nodeColor.length ? nodeColor : "#ff0000"}
                className="border p-2 rounded-md mr-2ß w-[30%] h-9 outline-none bg-[#f5f6fa]"
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
          <hr />
          {/* Connected Nodes */}
          <div>
            <p>Connected Nodes</p>
            {outgoers &&
              outgoers.map((item) => (
                <div className="flex items-center justify-between border border-red-400 p-2 rounded-lg my-2">
                  {item.data.title}
                  <button
                    onClick={() => onConnectedNodeDelete(item.id)}
                    className="bg-red-400 p-1 rounded-full text-white"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
          </div>
        </div>
        <button
          className="absolute bottom-6 bg-green-500 w-[90%] py-2 text-white rounded-lg"
          onClick={(e) => onSave(e)}
        >
          Save
        </button>
      </Modal>
    </div>
  );
}

export default NodeEditModal;
