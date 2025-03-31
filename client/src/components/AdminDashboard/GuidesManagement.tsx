import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiTrash, FiX } from "react-icons/fi";

const API_URL = "http://localhost:5000/api/guides";

interface Guide {
  _id: string;
  fileName: string;
  fileUrl: string;
  countryCode: string;
}

const GuidesManagement: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch Guides
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setGuides(res.data))
      .catch((err) => console.error("Error fetching guides:", err));
  }, []);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddGuide = () => {
    if (!selectedFile || !countryCode.trim()) {
      alert("Please select a file and enter a country code.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("countryCode", countryCode);

    axios
      .post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setGuides([...guides, res.data]);
        setSelectedFile(null);
        setCountryCode("");
        setShowModal(false);
      })
      .catch((err) => console.error("Error uploading guide:", err));
  };

  const handleDeleteGuide = (id: string) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setGuides((prev) => prev.filter((guide) => guide._id !== id)))
      .catch((err) => console.error("Error deleting guide:", err));
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Guides Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
        >
          <FiPlus /> Add Guide
        </button>
      </div>

      {/* Modal for Adding Guide */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-black">Upload Guide</h3>
              <button onClick={() => setShowModal(false)} className="text-red-500">
                <FiX />
              </button>
            </div>
            <input type="file" onChange={handleFileChange} className="mb-2 w-full" />

            {/* Country Code Dropdown */}
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-2 py-1 border rounded mb-2 text-black"
            >
              <option value="">Select Country</option>
              <option value="US">🇺🇸 USA </option>
              <option value="GB">🇬🇧 UK </option>
              {/* <option value="IN">🇮🇳 India (+91)</option> */}
              <option value="CA">🇨🇦 Canada </option>
              <option value="AU">🇦🇺 Australia </option>
              <option value="GER">GER Germany </option>
              {/* Add more country codes here */}
            </select>

            <button
              onClick={handleAddGuide}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </div>
      )}



      {/* Guides List */}
      <div className="space-y-4">
        {guides.map((guide) => (
          <div key={guide._id} className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span>
              {guide.fileName} ({guide.countryCode})
            </span>
            <div className="flex gap-2">
              <a
                href={guide.fileUrl}
                download={guide.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                View
              </a>
              <button onClick={() => handleDeleteGuide(guide._id)} className="text-red-400 hover:text-red-300">
                <FiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidesManagement;