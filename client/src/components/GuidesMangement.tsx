import React, { useState } from 'react';
import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';

const GuidesManagement: React.FC = () => {
  const [guides, setGuides] = useState<{ id: string; fileName: string }[]>([]);
  const [newGuideName, setNewGuideName] = useState('');
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [editedGuideName, setEditedGuideName] = useState('');

  const handleAddGuide = () => {
    if (newGuideName.trim()) {
      setGuides([...guides, { id: Date.now().toString(), fileName: newGuideName }]);
      setNewGuideName('');
    }
  };

  const handleEditGuide = (guide: { id: string; fileName: string }) => {
    setEditingGuideId(guide.id);
    setEditedGuideName(guide.fileName);
  };

  const handleSaveGuide = (id: string) => {
    setGuides((prev) =>
      prev.map((g) => (g.id === id ? { ...g, fileName: editedGuideName } : g))
    );
    setEditingGuideId(null);
    setEditedGuideName('');
  };

  const handleCancelEditGuide = () => {
    setEditingGuideId(null);
    setEditedGuideName('');
  };

  const handleDeleteGuide = (id: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 rounded-2xl border border-blue-800/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Guides Management</h2>
        <button
          onClick={handleAddGuide}
          className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-all"
        >
          <FiPlus /> Add Guide
        </button>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => (
          <div key={guide.id} className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            {editingGuideId === guide.id ? (
              <>
                <input
                  type="text"
                  value={editedGuideName}
                  onChange={(e) => setEditedGuideName(e.target.value)}
                  className="bg-transparent border-b border-blue-600/50 focus:outline-none w-full"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveGuide(guide.id)} className="text-green-400 hover:text-green-300">
                    Save
                  </button>
                  <button onClick={handleCancelEditGuide} className="text-red-400 hover:text-red-300">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{guide.fileName}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditGuide(guide)} className="text-blue-400 hover:text-blue-300">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDeleteGuide(guide.id)} className="text-red-400 hover:text-red-300">
                    <FiTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidesManagement;