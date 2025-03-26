// import React, { useState, useEffect } from "react";
// import { createDirectus, rest, readItems, createItem } from "@directus/sdk";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import "./SurveyForm.css";

// // Initialize Directus client
// const directus = createDirectus("http://localhost:8055").with(rest());

// function SurveyForm({ closeModal }) {
//   const [questions, setQuestions] = useState([]); 
//   const [responses, setResponses] = useState({}); 
//   const [loading, setLoading] = useState(true);

// //   Fetch questions from Directus
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         const response = await directus.request(
//           readItems("survey_questions", {
//             fields: ["id", "questions "],
//           })
//         );
//         console.log("Fetched questions:", response); 
//         setQuestions(response || []);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         toast.error("Failed to load survey questions. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // Handle textarea changes
//   const handleResponseChange = (questionId, value) => {
//     setResponses((prevResponses) => ({ ...prevResponses, [questionId]: value }));
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check if all questions have responses
//     const unansweredQuestions = questions.filter(q => !responses[q.id] || responses[q.id].trim() === '');
//     if (unansweredQuestions.length > 0) {
//       toast.warning("Please answer all questions before submitting.");
//       return;
//     }
  
//     try {
//       // Show loading toast
//       const loadingToastId = toast.loading("Submitting your responses...");
      
//       // Format responses as a JSON object with question text as keys
//       const formattedResponses = {};
//       questions.forEach(question => {
//         // Use the correct field name here - 'questions' instead of 'question'
//         formattedResponses[question.questions] = responses[question.id];
//       });
      
//       // Create a single record with all responses in the survey_data field
//       await directus.request(
//         createItem("survey_response", {
//           survey_data: formattedResponses
//         })
//       );
      
//       // Update loading toast to success
//       toast.update(loadingToastId, { 
//         render: "Survey submitted successfully!", 
//         type: "success", 
//         isLoading: false,
//         autoClose: 5000
//       });
      
//       // Clear responses after successful submission
//       setResponses({});
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       toast.error("Failed to submit survey. Please try again.");
//     }
//   };
  
  

//   return (
//     <div className="survey-form">
//       <ToastContainer position="top-right" autoClose={5000} />
//       <div className="survey-heading"><h2>Survey Form</h2></div>

//       {loading ? (
//         <p>Loading questions...</p>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                     {questions.length > 0 ? (
//           questions.map((question, index) => (
//             <div key={question.id} className="question-row">
//               <label className="question-label">
//                 Q-{index + 1}: {question.questions}
//               </label>
//               <textarea
//                 placeholder="Type your response here..."
//                 value={responses[question.id] || ""}
//                 onChange={(e) => handleResponseChange(question.id, e.target.value)}
//                 className="question-input resizable-textarea"
//               />
//             </div>
//           ))
//         ) : (
//           <p>No questions available.</p>
//         )}

//             <div className="buttonGroup">
//             <button type="submit" className="submit-button">
//                 Submit
//             </button>
//             <button type="button" className="close-button" onClick={closeModal}>Close</button>

//             </div>
            
            
//         </form>

//       )}
//     </div>
//   );
// }

// export default SurveyForm;



import React, { useState, useEffect } from "react";
import "./SurveyForm.css";

function PlannedMarginTable({ closeModal }) {
  const initialData = [
    {
      businessUnit: "Apparel",
      plannedSales: 10000000,
      plannedMargin: 4500000,
      approvedMargin: 4200000
    },
    {
      businessUnit: "Footwear",
      plannedSales: 5000000,
      plannedMargin: 2250000,
      approvedMargin: 2500000
    },
    {
      businessUnit: "Accessories",
      plannedSales: 3000000,
      plannedMargin: 1200000,
      approvedMargin: 1150000
    }
  ];

  // Initialize state from localStorage or use initialData if nothing is stored
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('tableData');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  
  const [editCell, setEditCell] = useState({
    rowIndex: null,
    columnName: null
  });
  
  const [editValue, setEditValue] = useState("");
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);
  
  const handleCellClick = (rowIndex, columnName, value) => {
    // Don't allow editing of businessUnit column
    if (columnName === "businessUnit") return;
    
    setEditCell({
      rowIndex,
      columnName
    });
    setEditValue(value);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  // Save the edited value
  const handleSave = () => {
    const newData = [...data];
    newData[editCell.rowIndex][editCell.columnName] = Number(editValue);
    
    setData(newData);
    setEditCell({ rowIndex: null, columnName: null });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditCell({ rowIndex: null, columnName: null });
  };

  // Handle form submission
  const handleSubmit = () => {
    alert("Data submitted successfully!");
    // Here you would typically send the data to a server
  };

  // Render cell content (editable or static)
  const renderCell = (rowIndex, columnName, value) => {
    const isEditing = editCell.rowIndex === rowIndex && editCell.columnName === columnName;
    
    if (isEditing) {
      return (
        <div className="edit-cell">
          <input
            type="number"
            value={editValue}
            onChange={handleInputChange}
            autoFocus
            className="edit-input"
          />
          <div className="edit-buttons">
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className={`cell-content ${columnName === "businessUnit" ? "non-editable" : "editable"}`}
        onClick={() => handleCellClick(rowIndex, columnName, value)}
      >
        {columnName === "businessUnit" ? value : value.toLocaleString()}
      </div>
    );
  };

  return (
    <div className="margin-table-container">
      <h2>Survey Form</h2>
      <p>Test Description</p>
      
      <table className="margin-table">
        <thead>
          <tr>
            <th>Business Unit</th>
            <th>Planned Sales ($)</th>
            <th>Planned Margin ($)</th>
            <th>Approved Margin ($)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{renderCell(rowIndex, "businessUnit", row.businessUnit)}</td>
              <td>{renderCell(rowIndex, "plannedSales", row.plannedSales)}</td>
              <td>{renderCell(rowIndex, "plannedMargin", row.plannedMargin)}</td>
              <td>{renderCell(rowIndex, "approvedMargin", row.approvedMargin)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="buttonGroup">
        <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
        <button type="button" className="close-button" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default PlannedMarginTable;


