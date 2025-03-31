import React, { useState, useEffect } from "react";
import { db } from "../backend/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../backend/firebase";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState<{ userId: string; name: string } | null>(null);

  const [firebaseUser] = useAuthState(auth); // Get logged-in Firebase user

  // Fetch user details from MongoDB
  useEffect(() => {
    if (!firebaseUser) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${firebaseUser.uid}`); // Fetch from MongoDB
        const data = await response.json();

        if (response.ok) {
          setUserDetails(data);
        } else {
          console.error("Error fetching user details:", data.error);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserData();
  }, [firebaseUser]);

  const handlePost = async () => {
    if (!userDetails || postContent.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "threads"), {
        content: postContent,
        userId: userDetails.userId, // MongoDB user ID
        name: userDetails.name, // MongoDB user name
        createdAt: serverTimestamp(),
      });

      setPostContent("");
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Try again.");
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button 
            onClick={handlePost} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
