import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Routes,Route } from 'react-router-dom';

function App() {
  
  return (
    <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
  );
         
}

export default App;