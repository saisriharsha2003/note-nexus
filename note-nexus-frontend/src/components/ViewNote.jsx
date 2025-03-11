import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { motion } from "framer-motion";
import "../assets/styles/viewnote.css";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const modules = {
    toolbar: false,
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/note/${id}`);
        setNote(response.data.note);
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  return (
    <div>
      <Nav />

      <motion.div
        className="view-note-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="view-note-box">
          <motion.h2
            className="title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            View Note
          </motion.h2>

          {loading ? (
            <motion.p
              className="loading-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Loading note...
            </motion.p>
          ) : (
            <motion.form
              className="view-note-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="input-box">
                <label className="label">Title</label>
                <motion.input
                  type="text"
                  value={note?.title || ""}
                  readOnly
                  className="title-input"
                  whileHover={{ scale: 1.05 }}
                />
              </div>

              <div className="input-box">
                <label className="label">Content</label>
                <motion.div
                  className="content-display"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ReactQuill
                    value={note?.content || ""}
                    readOnly={true}
                    theme="bubble"
                    modules={modules}
                    className="quill-content"
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => navigate("/view-notes")}
                className="back-button"
              >
                Back to View Notes
              </motion.button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewNote;
