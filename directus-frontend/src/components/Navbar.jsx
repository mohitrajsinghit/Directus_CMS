import React, { useState } from "react";
import Modal from "react-modal";
import logo from "../assets/rad_logo.jpg"; 
import SeedPlanPage from "../pages/SeedPlanPage"; 
import SurveyForm from "../pages/SurveyForm";




Modal.setAppElement("#root");

function Navbar() {
  const [modalContent, setModalContent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Company Logo" className="navbar-logo" />
        </div>
        <div className="navbar-center">New Platform</div>
        <div className="navbar-right">
          {/* Survey Button */}
          <button
            className="survey-button"
            onClick={() => openModal(<SurveyForm closeModal={closeModal} />)}
            
          >
            Survey Form
          </button>

          {/* Seed Button */}
          <button
            className="seed-button"
            onClick={() => openModal(<SeedPlanPage closeModal={closeModal} />)}

          >
            Seed
          </button>
        </div>
      </nav>

      {/* Modal for Seed Plan or Survey */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.75)",
          },
          content: {
            width: "50%",
            margin: "20px auto",
          },
        }}
        contentLabel="Modal"
      >
        {modalContent}
      </Modal>
    </div>
  );
}

export default Navbar;
