// pages/SeedPlanPage.jsx
import React, { useState, useEffect } from "react";
import { createDirectus, rest, readItems } from "@directus/sdk";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./SeedPlanPage.css";

const directus = createDirectus("http://localhost:8055").with(rest());

function SeedPlanPage({ closeModal }) {
  const [version, setVersion] = useState("Test Version");
  const [businessUnit, setBusinessUnit] = useState("");
  const [seedSource, setSeedSource] = useState("");
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  const [seedSourceOptions, setSeedSourceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [tasksComplete, setTasksComplete] = useState(false);
  const [setPolling] = useState(false);
  const [setIsSeedOpen] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [businessUnitsResponse, seedSourcesResponse] = await Promise.all([
          directus.request(readItems("business_units", { fields: ["id", "name"] })),
          directus.request(readItems("seed_sources", { fields: ["id", "name"] }))
        ]);
        
        setBusinessUnitOptions(businessUnitsResponse || []);
        setSeedSourceOptions(seedSourcesResponse || []);
      } catch (error) {
        console.error("Error fetching data from Directus:", error);
        toast.error("Error fetching data from Directus");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pollTaskInstances = async (dagRunId) => {
    const interval = 5000; // 5 seconds
    const endpoint = `http://localhost:8080/api/v1/dags/mfp_seeding_from_previous_dataset/dagRuns/${dagRunId}/taskInstances`;

    const fetchTaskInstances = async () => {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("airflow:airflow"),
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const allSuccessful = data.task_instances.every(
          (task) => task.state === "success"
        );

        if (allSuccessful) {
          setTasksComplete(true);
          setNotification("Seeding Plan successfully!");
          setPolling(false);
        } else {
          setTimeout(fetchTaskInstances, interval);
        }
      } catch (err) {
        console.error("Error during task instance polling:", err);
        toast.error("Task polling failed. Please try again.");
        setPolling(false);
      }
    };

    fetchTaskInstances();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessUnit || !seedSource) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const formData = { version, businessUnit, seedSource };

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

      if (!response.ok) throw new Error("Failed to trigger DAG");

      const result = await response.json();
      toast.success("DAG Triggered successfully!");
      setPolling(true);
      pollTaskInstances(result.dag_run_id);
    } catch (err) {
      console.error("Error triggering DAG:", err);
      toast.error("DAG Trigger unsuccessful!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasksComplete) {
      toast.success(notification);
      setTasksComplete(false);
      setIsSeedOpen(false);
    }
  }, [tasksComplete, notification]);

  return (
    <div className="formContainer">
      <ToastContainer position="top-right" autoClose={5000} />
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
              <option value="" disabled>Select Business Unit</option>
              {businessUnitOptions.map((unit) => (
                <option key={unit.id} value={unit.name}>{unit.name}</option>
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
              <option value="" disabled>Select Seed Source</option>
              {seedSourceOptions.map((source) => (
                <option key={source.id} value={source.name}>{source.name}</option>
              ))}
            </select>
          </div>

          <div className="buttonGroup">
            <button type="submit" className="submitButton">Submit</button>
            <button type="reset" className="resetButton" onClick={() => {
              setVersion("Test Version");
              setBusinessUnit("");
              setSeedSource("");
            }}>Reset</button>
            <button type="button" className="closeButton" onClick={closeModal}>Close</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SeedPlanPage;



// pages/SeedPlanPage.jsx
// import React, { useState, useEffect } from "react";
// import { createDirectus, rest, readItems } from "@directus/sdk";
// import "./SeedPlanPage.css";

// // Initialize Directus client correctly
// const directus = createDirectus("http://localhost:8055").with(rest());

// function SeedPlanPage({ closeModal }) {
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = { 
//       version, 
//       businessUnit, 
//       seedSource 
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/v1/dags/mfp_seeding_from_previous_dataset/dagRuns",
//         {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: "Basic " + btoa("airflow:airflow"),
//         },
//         body: JSON.stringify({ conf: formData }),
//         }
//       );

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
//     <div className="formContainer">
//       <h2 className="formTitle">Seed Plan</h2>

//       {loading ? (
//         <p>Loading options...</p>
//       ) : (
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
//               <option value="" disabled>
//                 Select Business Unit
//               </option>
//               {Array.isArray(businessUnitOptions) && businessUnitOptions.map((unit) => (
//                 <option key={unit.id} value={unit.name}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="formGroup">
//             <label className="formLabel">Select Seed Source *</label>
//             <select
//               value={seedSource}
//               onChange={(e) => setSeedSource(e.target.value)}
//               className="formSelect"
//             >
//               <option value="" disabled>
//                 Select Seed Source
//               </option>
//               {Array.isArray(seedSourceOptions) && seedSourceOptions.map((source) => (
//                 <option key={source.id} value={source.name}>
//                   {source.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="buttonGroup">
//             <button type="submit" className="submitButton">
//               Submit
//             </button>
//             <button
//               type="reset"
//               className="resetButton"
//               onClick={() => {
//                 setVersion("Test Version");
//                 setBusinessUnit("");
//                 setSeedSource("");
//               }}
//             >
//               Reset
//             </button>
//             <button type="button" className="closeButton" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

// export default SeedPlanPage;


