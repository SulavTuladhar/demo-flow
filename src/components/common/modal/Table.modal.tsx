import React, { useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "react-modal";
import { TableComponent } from "../Table.component";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "",
  },
};

interface ModalInterface {
  data?: any;
  isModalOpen: boolean;
  closeModal: () => void;
  title: string;
  saveFunc?: (data) => void;
}

function TableModal({
  data,
  isModalOpen,
  closeModal,
  saveFunc,
}: ModalInterface) {
  // const { title, description, color } = useMemo(() => {
  //   return {
  //     title: data.title,
  //     description: data.description,
  //     color: data.color,
  //   };
  // }, [data]);
  // const [nodeTitle, setNodeTitle] = useState<string>(title ?? "");
  // const [nodeDescription, setNodeDescription] = useState<string>(
  //   description ?? ""
  // );
  // const [nodeColor, setColor] = useState<string>(color ?? "");

  // const onSave = (e) => {
  //   e.preventDefault();
  //   const updatedData = {
  //     title: nodeTitle,
  //     description: nodeDescription,
  //     color: nodeColor,
  //   };
  //   saveFunc(updatedData);
  // };
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex items-center justify-between pb-4">
          <p>{data?.title ? `Edit  ?? "Node"}` : `Add Node Detail`}</p>
          <button
            onClick={() => {
              closeModal();
            }}
          >
            X
          </button>
        </div>
        <hr />
        <TableComponent />
      </Modal>
    </div>
  );
}

export default TableModal;
