import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

import { SideNavigation } from "./blocks/SideNavigation";
import { MainContent } from "./blocks/MainContent";
function App() {
  return (
    <div className="bg-background w-screen min-h-screen overflow-auto flex">
      <Router>
        <SideNavigation />
        <MainContent />
      </Router>
    </div>
  );
}

export default App;
