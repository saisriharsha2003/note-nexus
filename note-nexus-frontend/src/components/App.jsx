import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import AddNote from "./AddNote";
import ViewNotes from "./ViewNotes";
import ViewNote from "./ViewNote";
import EditNote from "./EditNote";
import DeleteNote from "./DeleteNote";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import ResetPassword from "./ResetPassword";
import VerifyCode from "./VerifyCode";
import NewPassword from "./NewPassword";
import { ToastContainer } from "react-toastify";
import NotificationsPage from "./NotificationsPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/view-notes" element={<ViewNotes />} />
        <Route path="/view-note/:id" element={<ViewNote />} />
        <Route path="/edit-note/:id" element={<EditNote />} />
        <Route path="/delete-note/:id" element={<DeleteNote />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
