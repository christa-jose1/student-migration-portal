import { useState, useEffect } from "react";

interface AddPostProps {
  onPostCreated?: () => void;
}

const AddPost = ({ onPostCreated }: AddPostProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Accommodation" | "Education" | "Visa">("Education");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);

  const API_URL = "http://localhost:5000/api/posts/";

  useEffect(() => {
    // Get userId from sessionStorage
    const userId = sessionStorage.getItem("mongoId");
    setMongoUserId(userId);
  }, []);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mongoUserId) {
      setError("You must be logged in to create a post.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mongoUserId,
          title,
          category,
          content,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Post created successfully:", data);
        setTitle("");
        setCategory("Education");
        setContent("");
        
        // Call the callback if it exists
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error creating post");
      }
    } catch (err) {
      setError("Error creating post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      {/* Post Form */}
      <form
        onSubmit={handleSubmitPost}
        className="space-y-4 mb-8 bg-[#121a2a] p-6 rounded-lg border border-[#1a2642]"
      >
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-[#1e293b] text-gray-300 border border-[#2a3b52] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
            maxLength={100}
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "Accommodation" | "Education" | "Visa")}
            className="w-full p-3 bg-[#1e293b] text-gray-300 border border-[#2a3b52] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="Education">Education</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Visa">Visa</option>
          </select>
        </div>
        <div>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-[#1e293b] text-gray-300 border border-[#2a3b52] rounded-lg h-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors disabled:bg-blue-900 disabled:text-blue-300"
          disabled={loading}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default AddPost;