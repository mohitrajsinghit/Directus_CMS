// import React, { useState, useEffect } from "react";
// import { createDirectus, rest, readItems, createItem } from "@directus/sdk";


// // Initialize Directus client
// const directus = createDirectus("http://localhost:8055").with(rest());

// function SurveyForm() {
//   const [questions, setQuestions] = useState([]); 
//   const [responses, setResponses] = useState({}); 
//   const [loading, setLoading] = useState(true);

//   // Fetch questions from Directus
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         const response = await directus.request(
//           readItems("survey_questions", {
//             fields: ["id", "question"],
//           })
//         );
//         console.log("Fetched questions:", response); 
//         setQuestions(response  || []);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
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


// const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       for (const [questionId, response] of Object.entries(responses)) {
//         await directus.request(
//           createItem("survey_responses", {
//             question_id: parseInt(questionId),
//             response,
//           })
//         );
//       }
  
//       alert("Survey submitted successfully!");
//       setResponses({});
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("Failed to submit survey.");
//     }
//   };
  

//   return (
//     <div className="survey-form">
//         <div className="survey-heading"> <h2>Survey Form</h2></div>
     

//       {loading ? (
//         <p>Loading questions...</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {questions.length > 0 ? (
//             questions.map((question, index) => (
//               <div key={question.id} style={{ marginBottom: "20px" }}>
//                 <label style={{ display: "block", fontWeight: "bold" }}>
//                   Q-{index + 1}: {question.question}
//                 </label>
//                 <textarea 
//                   placeholder="Type your response here..."
//                   value={responses[question.id] || ""}
//                   onChange={(e) =>
//                     handleResponseChange(question.id, e.target.value)
//                   }
//                   style={{
//                     marginTop:"10px",
//                     width: "97%",
//                     height: "90px",
//                     padding: "10px",
//                     borderRadius: "5px",
//                     border: "1px solid #ccc",
//                   }}
//                 />
//               </div>
//             ))
//           ) : (
//             <p>No questions available.</p>
//           )}
//           <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" , backgroundColor:"yellow"}}>
//             Submit Survey
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default SurveyForm;



import React, { useState, useEffect } from "react";
import { createDirectus, rest, readItems, createItem } from "@directus/sdk";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Directus client
const directus = createDirectus("http://localhost:8055").with(rest());

function SurveyForm() {
  const [questions, setQuestions] = useState([]); 
  const [responses, setResponses] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Fetch questions from Directus
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await directus.request(
          readItems("survey_questions", {
            fields: ["id", "question"],
          })
        );
        console.log("Fetched questions:", response); 
        setQuestions(response || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load survey questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle textarea changes
  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({ ...prevResponses, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions have responses
    const unansweredQuestions = questions.filter(q => !responses[q.id] || responses[q.id].trim() === '');
    if (unansweredQuestions.length > 0) {
      toast.warning("Please answer all questions before submitting.");
      return;
    }
  
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Submitting your responses...");
      
      for (const [questionId, response] of Object.entries(responses)) {
        await directus.request(
          createItem("survey_responses", {
            question_id: parseInt(questionId),
            response,
          })
        );
      }
      
      // Update loading toast to success
      toast.update(loadingToastId, { 
        render: "Survey submitted successfully!", 
        type: "success", 
        isLoading: false,
        autoClose: 5000
      });
      
      // Clear responses after successful submission
      setResponses({});
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    }
  };

  return (
    <div className="survey-form">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="survey-heading"><h2>Survey Form</h2></div>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id} style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "bold" }}>
                  Q-{index + 1}: {question.question}
                </label>
                <textarea 
                  placeholder="Type your response here..."
                  value={responses[question.id] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                  style={{
                    marginTop:"10px",
                    width: "97%",
                    height: "90px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
          <button type="submit" style={{ padding: "10px 20px", cursor: "pointer", backgroundColor:"yellow"}}>
            Submit Survey
          </button>
        </form>
      )}
    </div>
  );
}

export default SurveyForm;
