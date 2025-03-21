// // components/Navbar.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/rad_logo.jpg"; // Import your logo

// function Navbar() {
//   const navigate = useNavigate();

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src={logo} alt="Company Logo" className="navbar-logo" />
//       </div>
//       <div className="navbar-center">New Platform</div>
//       <div className="navbar-right">
//         <button className="seed-button" onClick={() => navigate("/seed-plan")}>
//           Seed
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


// components/Navbar.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import logo from "../assets/rad_logo.jpg"; // Import your logo
import SeedPlanPage from "../pages/SeedPlanPage"; // Import SeedPlanPage

function Navbar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Company Logo" className="navbar-logo" />
        </div>
        <div className="navbar-center">New Platform</div>
        <div className="navbar-right">
          <button className="seed-button" onClick={openModal}>
            Seed
          </button>
        </div>
      </nav>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            width: "50%",
            margin: "20px auto",
          },
        }}
        contentLabel="Seed Plan Modal"
      >
        <SeedPlanPage closeModal={closeModal} />
      </Modal>
    </div>
  );
}

export default Navbar;
