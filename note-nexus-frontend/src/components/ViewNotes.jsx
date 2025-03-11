import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { motion } from "framer-motion";
import "../assets/styles/viewnotes.css";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 4;
  const navigate = useNavigate();
  const MAX_CONTENT_LENGTH = 20;

  useEffect(() => {
    let isMounted = true;

    const fetchNotes = async () => {
      try {
        const uname = localStorage.getItem("username");
        const response = await axios.get(`${BASE_URL}/api/user/view-notes`, {
          params: { username: uname },
        });

        if (isMounted) {
          setNotes(response.data.notes || []);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1500,
          });
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to fetch notes.", {
            position: "top-right",
            autoClose: 1500,
          });
        }
        console.error("Error fetching notes:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (noteId) => navigate(`/edit-note/${noteId}`);
  const handleDelete = (noteId) => navigate(`/delete-note/${noteId}`);
  const handleView = (noteId) => navigate(`/view-note/${noteId}`);

  const lastNoteIndex = currentPage * notesPerPage;
  const firstNoteIndex = lastNoteIndex - notesPerPage;
  const currentNotes = notes.slice(firstNoteIndex, lastNoteIndex);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const changePage = (newPage) => setCurrentPage(newPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="view-notes-wrapper"
    >
      <Nav />
      <motion.div
        className="bg1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="container view-notes-container"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="title">All Notes</h2>

          {loading ? (
            <p className="loading-text">Loading notes...</p>
          ) : (
            <>
              <motion.table
                className="notes-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Last Edited By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNotes.length > 0 ? (
                    currentNotes.map((note, index) => (
                      <motion.tr
                        key={note._id}
                        className="note-row"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td>{note.owner}</td>
                        <td>{note.title}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                note.content.length > MAX_CONTENT_LENGTH
                                  ? `${note.content.slice(
                                      0,
                                      MAX_CONTENT_LENGTH
                                    )}...`
                                  : note.content,
                            }}
                          />
                          {note.content.length > MAX_CONTENT_LENGTH && (
                            <button
                              onClick={() => handleView(note._id)}
                              className="read-more-btn"
                            >
                              Read More
                            </button>
                          )}
                        </td>
                        <td>{note.lastEditedBy}</td>
                        <td className="action-buttons">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            onClick={() => handleView(note._id)}
                            className="view-btn"
                          >
                            <i className="fa fa-eye"></i>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            onClick={() => handleEdit(note._id)}
                            className="edit-btn"
                          >
                            <i className="fa fa-pencil"></i>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(note._id)}
                            className="delete-btn"
                          >
                            <i className="fa fa-trash"></i>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-notes-text">
                        No notes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </motion.table>

              <motion.div className="pagination">
                {currentPage > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => changePage(currentPage - 1)}
                    className="pagination-btn"
                  >
                    Previous
                  </motion.button>
                )}
                {[...Array(totalPages)].map((_, i) => (
                  <motion.button
                    key={i + 1}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => changePage(i + 1)}
                    className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
                {currentPage < totalPages && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => changePage(currentPage + 1)}
                    className="pagination-btn"
                  >
                    Next
                  </motion.button>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ViewNotes;
