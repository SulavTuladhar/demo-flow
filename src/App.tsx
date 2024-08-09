/* eslint-disable no-unused-vars */
import React from "react";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlowContainerComponent from "./components/ReactFlowContainer.component";

function App() {
  Modal.setAppElement(document.getElementById("root"));

  return (
    <div className="h-[100vh] w-full">
      <ReactFlowContainerComponent />
      <ToastContainer />
    </div>
  );
}

export default App;
