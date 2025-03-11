import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import sureImage from "../assets/images/sure.png";
import { motion } from "framer-motion";
import "../assets/styles/deletenote.css";

const DeleteNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  const handleCancel = () => {
    navigate("/view-notes");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/user/delete-note/${id}`, {
        params: { username: user },
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/view-notes");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.status === 403
          ? "You are not authorized to delete this note."
          : "Failed to delete note.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div>
      <Nav />
      <motion.div className="delete-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <motion.div className="delete-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="delete-header">
            <img src={sureImage} alt="Delete Confirmation" className="delete-img" />
            <p className="delete-title">Delete Note</p>
          </div>

          <motion.div className="delete-message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p>Are you sure you want to delete this note?</p>
          </motion.div>

          <motion.div className="button-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cancel-button" onClick={handleCancel}>
              Cancel
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="delete-button" onClick={handleDelete}>
              Delete
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeleteNote;
