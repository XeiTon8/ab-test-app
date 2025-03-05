import { BrowserRouter as Router, Routes, Route } from "react-router";

import './App.css'

import Dashboard from "./pages/dashboard";
import TestResults from "./pages/results";
import TestFinalize from "./pages/finalize";

function App() {

 return (
 <Router>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/results/:testID" element={<TestResults />} />
    <Route path="/finalize/:testID" element={<TestFinalize />} />
  </Routes>
 </Router>
 )
}

export default App
