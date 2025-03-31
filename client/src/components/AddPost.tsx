import { useEffect, useState } from "react";
import axios from "axios";

const Forum = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "Accomadation" | "Education" | "Visa"
  >("Education");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);

  const API_URL = "http://localhost:5000/api/Post/";

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
      await axios.post(`${API_URL}create`, {
        userId: mongoUserId,
        title,
        category,
        content,
      });
      setTitle("");
      setCategory("Education");
      setContent("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating post");
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
        className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={100}
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as "Accomadation" | "Education" | "Visa"
              )
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Education">Education</option>
            <option value="Accomadation">Accommodation</option>
            <option value="Visa">Visa</option>
          </select>
        </div>
        <div>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Forum;
