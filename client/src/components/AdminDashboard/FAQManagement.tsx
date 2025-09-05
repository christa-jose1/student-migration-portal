import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash, FiEdit } from "react-icons/fi";
import axios from "axios";

const API_URL = "http://localhost:5000/api/faqs";

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<
    { _id: string; question: string; answer: string }[]
  >([]);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [editingFAQ, setEditingFAQ] = useState<{
    _id: string;
    id: string;
    question: string;
    answer: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchFAQs = () => {
    axios
      .get(API_URL)
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error("Error fetching FAQs:", err));
  };

  // Call `fetchFAQs` on component mount
  useEffect(() => {
    fetchFAQs();
  }, []);
  const handleInputChange = (field: string, value: string) => {
    setNewFAQ((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      axios
        .post(API_URL, newFAQ)
        .then((res) => {
          setFaqs([...faqs, res.data]);
          handleCloseModal();
        })
        .catch((err) => console.error("Error adding FAQ:", err));
    }
  };

  const handleEditFAQ = (faq: {
    _id: string;
    question: string;
    answer: string;
  }) => {
    setEditingFAQ(faq);
    setShowModal(true);
  };

  const handleUpdateFAQ = () => {
    console.log(editingFAQ, ">>>>>>>>>>>>>>>>>>>>>>>>>>>");

    if (editingFAQ) {
      axios
        .put(`${API_URL}/${editingFAQ._id}`, {
          question: editingFAQ.question,
          answer: editingFAQ.answer,
        })
        .then((res) => {
          setFaqs(
            faqs.map((faq) => (faq._id === editingFAQ._id ? res.data : faq))
          );
          handleCloseModal();
        })
        .catch((err) => console.error("Error updating FAQ:", err));
    }
  };

  const handleDeleteFAQ = (id: string) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        fetchFAQs(); // Fetch updated FAQs list after deletion
      })
      .catch((err) => console.error("Error deleting FAQ:", err));
  };

  const handleCloseModal = () => {
    setNewFAQ({ question: "", answer: "" });
    setEditingFAQ(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-blue-800/30 bg-gradient-to-br from-blue-900/20 to-purple-900/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">FAQ Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg"
        >
          <FiPlus /> Add FAQ
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-900/10">
            <tr>
              <th className="px-4 py-3 text-left">Question</th>
              <th className="px-4 py-3 text-left">Answer</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr
                key={faq._id}
                className="hover:bg-blue-900/5 transition-colors"
              >
                <td className="px-4 py-3">{faq.question}</td>
                <td className="px-4 py-3">{faq.answer}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEditFAQ(faq)}
                    className="text-blue-400"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq._id)}
                    className="text-red-400"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
            </h3>
            <div className="flex flex-col space-y-4">
              <textarea
                type="text"
                placeholder="Question"
                className="px-4 py-2 text-black h-24 resize-y"
                value={editingFAQ ? editingFAQ.question : newFAQ.question}
                onChange={(e) =>
                  editingFAQ
                    ? setEditingFAQ({ ...editingFAQ, question: e.target.value })
                    : handleInputChange("question", e.target.value)
                }
              />
              <textarea
                type="text"
                placeholder="Answer"
                className="px-4 py-2 text-black h-24 resize-y"
                value={editingFAQ ? editingFAQ.answer : newFAQ.answer}
                onChange={(e) =>
                  editingFAQ
                    ? setEditingFAQ({ ...editingFAQ, answer: e.target.value })
                    : handleInputChange("answer", e.target.value)
                }
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={editingFAQ ? handleUpdateFAQ : handleAddFAQ}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
