import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { FaHeading, FaLock, FaGlobe } from "react-icons/fa";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import "../assets/styles/addnote.css";

const AddNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "private",
  });

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({ ...prevData, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const owner = localStorage.getItem("name");
    const uname = localStorage.getItem("uname");

    try {
      await axios.post(`${BASE_URL}/api/user/add-note`, {
        ...formData,
        owner,
        uname,
      });

      toast.success("Note added successfully!", { autoClose: 1500 });

      setTimeout(() => {
        toast.success("Redirecting to View Notes...", { autoClose: 1500 });
        setTimeout(() => {
          navigate("/view-notes");
        }, 1000);
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding note", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="addnote-container"
      >
        <motion.div className="addnote-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <h2 className="title">Create a New Note</h2>
          <form onSubmit={handleSubmit} className="addnote-form">
            <motion.div className="input-group" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <FaHeading className="icon" />
              <input
                type="text"
                name="title"
                placeholder="Enter you title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </motion.div>
            <motion.div className="input-group quill-container" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your note..."
                required
                modules={modules}
              />
            </motion.div>

            <motion.div className="visibility-options" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <motion.label
                whileHover={{ scale: 1.1 }}
                className={`visibility-label ${
                  formData.visibility === "private" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === "private"}
                  onChange={handleChange}
                />
                <FaLock className="visibility-icon" /> Private
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.1 }}
                className={`visibility-label ${
                  formData.visibility === "public" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === "public"}
                  onChange={handleChange}
                />
                <FaGlobe className="visibility-icon" /> Public
              </motion.label>
            </motion.div>

            <motion.button whileHover={{ scale: 1.1 }} type="submit" className="addnote-btn">
              {loading ? "Adding Note..." : "Add Note"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddNote;
