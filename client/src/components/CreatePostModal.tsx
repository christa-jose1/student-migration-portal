import React, { useState } from 'react';
import { db, auth } from '../backend/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [postContent, setPostContent] = useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!user || postContent.trim() === '') return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'threads'), {
        content: postContent,
        userId: user.uid,
        likes: [],
        comments: [],
        timestamp: serverTimestamp(),
      });
      setPostContent('');
      onClose(); // Close modal after posting
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <textarea
          className="w-full border p-2 rounded resize-none"
          rows={4}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button 
            onClick={handlePost} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
