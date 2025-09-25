import WorkSpace from "./display/WorkSpace"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<WorkSpace />} />
          <Route path="/*" element={<WorkSpace />} />
        </Routes>
      </Router>
      
    </div>
  )
}

export default App