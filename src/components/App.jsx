import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// import Privacy from "./Privacy";
// import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import TabConfig from "./TabConfig";
import "./App.css";
// import Dynamics365Entity from "./Dynamics365Entity";
// import EditEntity from "./EditEntity";
import MeetingSummary from "./MeetingSummary";
// import AddEmployee from "./AddEmployee";
// import AddEmployee from "./AddEmployee";
// import MeetingDetails from "./MeetingDetails";
// import DeleteEmployee from "./DeleteEmployee";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const dynamicMeetingId = "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEGhxJbAAA=";
  return (
    <>
    <Router>
      <Routes>
        {/* <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} /> */}
        <Route path="/tab" element={<Tab />} />
        <Route path="/config" element={<TabConfig />} />
        {/* <Route path="/dynamic365-entity" element={<Dynamics365Entity />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/meeting-summary" element={<MeetingSummary />} />
        <Route path="/edit-entity" element={<EditEntity />} /> */}

        
        {/* <Route path="/delete-employee/:id" element={<DeleteEmployee />} /> */}

      </Routes>
    </Router>
    <div>
      {/* <AddEmployee/> */}
      <MeetingSummary meetingId={dynamicMeetingId}/>
    </div>
    </>
  );
}

