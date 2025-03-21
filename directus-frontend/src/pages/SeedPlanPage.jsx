// // src/pages/SeedPlanPage.jsx

//This code is statically displaying contents from the react application 
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SeedPlanPage.css";

// function SeedPlanPage() {
//   const navigate = useNavigate();
//   const [version, setVersion] = useState("Test Version");
//   const [businessUnit, setBusinessUnit] = useState("Accessories");
//   const [seedSource, setSeedSource] = useState("LY");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       version,
//       businessUnit,
//       seedSource,
//     };

//     try {
//       const response = await fetch("http://localhost:8080/api/v1/dags/mfp_sales_data_seeding_column/dagRuns", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": "Basic " + btoa("airflow:airflow"), 
//         },
//         body: JSON.stringify({
//           conf: formData, // Pass form data as `conf`
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert(`DAG triggered successfully! Run ID: ${result.dag_run_id}`);
//       } else {
//         const error = await response.json();
//         alert(`Error: ${error.detail}`);
//       }
//     } catch (err) {
//       console.error("Error triggering DAG:", err);
//       alert("An error occurred while triggering the DAG.");
//     }
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
//         <button 
//           onClick={() => navigate(-1)}
//           style={{
//             backgroundColor: "#3498db",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             padding: "8px 15px",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px"
//           }}
//         >
//           ← Back
//         </button>
//       </div>
      
//       <div className="formContainer" style={{ width: "50%", margin: "20px auto" }}>
//         <h2 className="formTitle">Seed Plan</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="formGroup">
//             <label className="formLabel">Version *</label>
//             <input
//               type="text"
//               value={version}
//               onChange={(e) => setVersion(e.target.value)}
//               className="formInput"
//             />
//           </div>

//           <div className="formGroup">
//             <label className="formLabel">Business Unit *</label>
//             <select
//               value={businessUnit}
//               onChange={(e) => setBusinessUnit(e.target.value)}
//               className="formSelect"
//             >
//               <option value="Accessories">Accessories</option>
//               <option value="Apparel">Apparel</option>
//               <option value="Footwear">Footwear</option>
//             </select>
//           </div>

//           <div className="formGroup">
//             <label className="formLabel">Select Seed Source *</label>
//             <select
//               value={seedSource}
//               onChange={(e) => setSeedSource(e.target.value)}
//               className="formSelect"
//             >
//               <option value="LY">LY</option>
//               <option value="LLY">LLY</option>
//               <option value="LLLY">LLLY</option>
//             </select>
//           </div>

//           <div className="buttonGroup">
//             <button type="submit" className="submitButton">
//               Submit
//             </button>
//             <button type="reset" className="resetButton" onClick={() => {
//               setVersion("Test Version");
//               setBusinessUnit("Accessories");
//               setSeedSource("LY");
//             }}>
//               Reset
//             </button>
//             <button type="button" className="closeButton" onClick={() => navigate(-1)}>
//               Close
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SeedPlanPage;







































//This is the code for Dynamically fetching the data from Directus


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createDirectus, rest, readItems } from "@directus/sdk";
// import "./SeedPlanPage.css";

// // Initialize Directus client correctly
// const directus = createDirectus("http://localhost:8055").with(rest());

// function SeedPlanPage() {
//   const navigate = useNavigate();
//   const [version, setVersion] = useState("Test Version");
//   const [businessUnit, setBusinessUnit] = useState("");
//   const [seedSource, setSeedSource] = useState("");
//   const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
//   const [seedSourceOptions, setSeedSourceOptions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // console.log("Fetching business units and seed sources...");
        
//         // Fetch business units
//         const businessUnitsResponse = await directus.request(
//           readItems("business_units", { 
//             fields: ["id", "name"] 
//           })
//         );
        
//         // Fetch seed sources
//         const seedSourcesResponse = await directus.request(
//           readItems("seed_sources", { 
//             fields: ["id", "name"] 
//           })
//         );
        
//         // console.log("Business Units Response:", businessUnitsResponse);
//         // console.log("Seed Sources Response:", seedSourcesResponse);
        

//         // Check if data exists and set state
//         if (businessUnitsResponse) {
//             setBusinessUnitOptions(businessUnitsResponse);
//           }
        
//           if (seedSourcesResponse) {
//             setSeedSourceOptions(seedSourcesResponse);
//           }
//       } catch (error) {
//         console.error("Error fetching data from Directus:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = { 
//         version, 
//         businessUnit, 
//         seedSource 
//         };

//         try {
//         const response = await fetch(
//             "http://localhost:8080/api/v1/dags/mfp_seeding_from_previous_dataset/dagRuns",
//             {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: "Basic " + btoa("airflow:airflow"),
//             },
//             body: JSON.stringify({ conf: formData }),
//             }
//         );

//         if (response.ok) {
//             const result = await response.json();
//             alert(`DAG triggered successfully! Run ID: ${result.dag_run_id}`);
//         } else {
//             const error = await response.json();
//             alert(`Error: ${error.detail}`);
//         }
//         } catch (err) {
//         console.error("Error triggering DAG:", err);
//         alert("An error occurred while triggering the DAG.");
//         }
//     };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
//         <button className="back-button"
//           onClick={() => navigate(-1)}>
//           ← Back
//         </button>
//       </div>

//       <div className="formContainer" style={{ width: "50%", margin: "20px auto" }}>
//         <h2 className="formTitle">Seed Plan</h2>

//         {loading ? (
//           <p>Loading options...</p>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="formGroup">
//               <label className="formLabel">Version *</label>
//               <input
//                 type="text"
//                 value={version}
//                 onChange={(e) => setVersion(e.target.value)}
//                 className="formInput"
//               />
//             </div>

//             <div className="formGroup">
//                 <label className="formLabel">Business Unit *</label>
//                 <select
//                     value={businessUnit}
//                     onChange={(e) => setBusinessUnit(e.target.value)}
//                     className="formSelect"
//                 >
//                     <option value="" disabled>
//                     Select Business Unit
//                     </option>
//                     {Array.isArray(businessUnitOptions) && businessUnitOptions.map((unit) => (
//                     <option key={unit.id} value={unit.name}>
//                         {unit.name}
//                     </option>
//                     ))}
//                 </select>
//                 </div>

//                 <div className="formGroup">
//                 <label className="formLabel">Select Seed Source *</label>
//                 <select
//                     value={seedSource}
//                     onChange={(e) => setSeedSource(e.target.value)}
//                     className="formSelect"
//                 >
//                     <option value="" disabled>
//                     Select Seed Source
//                     </option>
//                     {Array.isArray(seedSourceOptions) && seedSourceOptions.map((source) => (
//                     <option key={source.id} value={source.name}>
//                         {source.name}
//                     </option>
//                     ))}
//                 </select>
//                 </div>


//             <div className="buttonGroup">
//               <button type="submit" className="submitButton">
//                 Submit
//               </button>
//               <button
//                 type="reset"
//                 className="resetButton"
//                 onClick={() => {
//                   setVersion("Test Version");
//                   setBusinessUnit("");
//                   setSeedSource("");
//                 }}
//               >
//                 Reset
//               </button>
//               <button type="button" className="closeButton" onClick={() => navigate(-1)}>
//                 Close
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SeedPlanPage;




































// pages/SeedPlanPage.jsx
import React, { useState, useEffect } from "react";
import { createDirectus, rest, readItems } from "@directus/sdk";
import "./SeedPlanPage.css";

// Initialize Directus client correctly
const directus = createDirectus("http://localhost:8055").with(rest());

function SeedPlanPage({ closeModal }) {
  const [version, setVersion] = useState("Test Version");
  const [businessUnit, setBusinessUnit] = useState("");
  const [seedSource, setSeedSource] = useState("");
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  const [seedSourceOptions, setSeedSourceOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch business units
        const businessUnitsResponse = await directus.request(
          readItems("business_units", { 
            fields: ["id", "name"] 
          })
        );
        
        // Fetch seed sources
        const seedSourcesResponse = await directus.request(
          readItems("seed_sources", { 
            fields: ["id", "name"] 
          })
        );
        
        // Check if data exists and set state
        if (businessUnitsResponse) {
            setBusinessUnitOptions(businessUnitsResponse);
          }
        
          if (seedSourcesResponse) {
            setSeedSourceOptions(seedSourcesResponse);
          }
      } catch (error) {
        console.error("Error fetching data from Directus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { 
      version, 
      businessUnit, 
      seedSource 
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/dags/mfp_seeding_from_previous_dataset/dagRuns",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("airflow:airflow"),
        },
        body: JSON.stringify({ conf: formData }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`DAG triggered successfully! Run ID: ${result.dag_run_id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (err) {
      console.error("Error triggering DAG:", err);
      alert("An error occurred while triggering the DAG.");
    }
  };

  return (
    <div className="formContainer">
      <h2 className="formTitle">Seed Plan</h2>

      {loading ? (
        <p>Loading options...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">Version *</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">Business Unit *</label>
            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="formSelect"
            >
              <option value="" disabled>
                Select Business Unit
              </option>
              {Array.isArray(businessUnitOptions) && businessUnitOptions.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label className="formLabel">Select Seed Source *</label>
            <select
              value={seedSource}
              onChange={(e) => setSeedSource(e.target.value)}
              className="formSelect"
            >
              <option value="" disabled>
                Select Seed Source
              </option>
              {Array.isArray(seedSourceOptions) && seedSourceOptions.map((source) => (
                <option key={source.id} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div className="buttonGroup">
            <button type="submit" className="submitButton">
              Submit
            </button>
            <button
              type="reset"
              className="resetButton"
              onClick={() => {
                setVersion("Test Version");
                setBusinessUnit("");
                setSeedSource("");
              }}
            >
              Reset
            </button>
            <button type="button" className="closeButton" onClick={closeModal}>
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SeedPlanPage;
