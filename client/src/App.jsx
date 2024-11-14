import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Manager from "./Manager";
import { SavedPasswords } from "./SavedPasswords";
import Otp from "./GenerateOTP";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="manager" element={<Manager />} />
        <Route path="passwords" element={<SavedPasswords />} />
        <Route path="forgot" element={<Otp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
