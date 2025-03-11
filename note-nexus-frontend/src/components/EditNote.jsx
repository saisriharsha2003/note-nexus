import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { FaHeading, FaLock, FaGlobe } from "react-icons/fa";
import "../assets/styles/editnote.css";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    lastEditedBy: "",
    owner: "",
    visibility: "private",
  });

  const user = localStorage.getItem("username");

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

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/note/${id}`);
        setFormData({
          title: response.data.note.title,
          content: response.data.note.content,
          lastEditedBy: response.data.note.lastEditedBy || "Unknown",
          owner: response.data.note.owner_username,
          visibility: response.data.note.visibility || "private",
        });
      } catch (error) {
        toast.error("Failed to load the note.", {
          position: "top-right",
          autoClose: 1500,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({ ...prevData, content: value }));
  };

  const handleVisibilityToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      visibility: prevData.visibility === "private" ? "public" : "private",
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/user/edit-note`, {
        ...formData,
        id: id,
        lastEditedBy: localStorage.getItem("name"),
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/view-notes");
      }, 2000);
    } catch (error) {
      toast.error("Failed to save note.", {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  return (
    <div>
      <Nav />
      <motion.div
        className="bg1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="edit-note-container"
        >
          <motion.div
            className="edit-box"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="title">Edit Note</h2>
            {loading ? (
              <p className="loading-text">Loading note...</p>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="input-box1 w-full mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <label className="label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="title-input"
                  />
                </motion.div>
                <motion.div
                  className="input-box1 w-full pb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <label className="label">Content</label>
                  <ReactQuill
                    value={formData.content}
                    modules={modules}
                    onChange={handleContentChange}
                    className="content-editor"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
                <motion.div
                  className="visibility-options"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
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
                <motion.div
                  className="button-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.001 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleSave}
                    className="save-button"
                  >
                    Save Note
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.001 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => navigate("/view-notes")}
                    className="cancel-button"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditNote;
