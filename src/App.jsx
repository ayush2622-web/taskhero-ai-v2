import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Analytics from "./Analytics";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path = "/analytics" element={<Analytics/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path ="/tasks" element={<Tasks/>}/>
    </Routes>
    
  );
}

export default App;