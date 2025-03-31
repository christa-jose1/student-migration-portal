import React, { useState } from 'react';
import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';
import { University } from '../../types';

const UniversitiesManagement: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [newUniversity, setNewUniversity] = useState<Partial<University>>({});
  const [editingUniversityId, setEditingUniversityId] = useState<string | null>(null);
  const [editedUniversityName, setEditedUniversityName] = useState("");
  const [editedUniversityLocation, setEditedUniversityLocation] = useState("");
  const [editedUniversityRanking, setEditedUniversityRanking] = useState("");

  const handleAddUniversity = () => {
    if (newUniversity.name && newUniversity.location) {
      setUniversities([
        ...universities,
        {
          ...newUniversity,
          id: Date.now().toString(),
          ranking: newUniversity.ranking || "",
        } as University,
      ]);
      setNewUniversity({});
    }
  };

  const handleEditUniversity = (uni: University) => {
    setEditingUniversityId(uni.id);
    setEditedUniversityName(uni.name);
    setEditedUniversityLocation(uni.location);
    setEditedUniversityRanking(uni.ranking);
  };

  const handleSaveUniversity = (id: string) => {
    setUniversities((prev) =>
      prev.map((uni) =>
        uni.id === id
          ? {
              ...uni,
              name: editedUniversityName,
              location: editedUniversityLocation,
              ranking: editedUniversityRanking,
            }
          : uni
      )
    );
    setEditingUniversityId(null);
    setEditedUniversityName("");
    setEditedUniversityLocation("");
    setEditedUniversityRanking("");
  };

  const handleCancelEditUniversity = () => {
    setEditingUniversityId(null);
    setEditedUniversityName("");
    setEditedUniversityLocation("");
    setEditedUniversityRanking("");
  };

  const handleDeleteUniversity = (id: string) => {
    setUniversities((prev) => prev.filter((uni) => uni.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-6 rounded-2xl border border-purple-800/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Universities Management</h2>
        <button
          onClick={handleAddUniversity}
          className="flex items-center gap-2 bg-purple-600/30 hover:bg-purple-600/50 px-4 py-2 rounded-lg transition-all"
        >
          <FiPlus /> Add University
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map((uni) => (
          <div key={uni.id} className="p-4 bg-black/20 rounded-xl border border-blue-800/30 hover:border-blue-500 transition-all">
            {editingUniversityId === uni.id ? (
              <>
                <input
                  type="text"
                  value={editedUniversityName}
                  onChange={(e) => setEditedUniversityName(e.target.value)}
                  className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                />
                <input
                  type="text"
                  value={editedUniversityLocation}
                  onChange={(e) => setEditedUniversityLocation(e.target.value)}
                  className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                />
                <input
                  type="text"
                  value={editedUniversityRanking}
                  onChange={(e) => setEditedUniversityRanking(e.target.value)}
                  className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveUniversity(uni.id)} className="text-green-400 hover:text-green-300">Save</button>
                  <button onClick={handleCancelEditUniversity} className="text-red-400 hover:text-red-300">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{uni.name}</h3>
                <p>{uni.location}</p>
                <p>{uni.ranking}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditUniversity(uni)} className="text-blue-400 hover:text-blue-300"><FiEdit /></button>
                  <button onClick={() => handleDeleteUniversity(uni.id)} className="text-red-400 hover:text-red-300"><FiTrash /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversitiesManagement;