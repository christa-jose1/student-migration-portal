import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageSquare, Flag, Trash2, Edit, X } from "lucide-react";

const API_URL = "http://localhost:5000/api/posts";

interface Post {
  _id: string;
  content: string;
  title: string;
  category?: string;
  user?: { _id: string; name?: string };
  likes: string[];
  comments: { _id: string; user?: { name?: string }; text: string }[];
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
}

// Add Post Form Modal Component
const AddPostModal = ({ isOpen, onClose, categories }: { 
  isOpen: boolean; 
  onClose: () => void; 
  categories: { [key: string]: Category };
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Education");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = sessionStorage.getItem("mongoId");

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to create a post.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
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
        onClose();
        // The parent component will refetch posts
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-[#121a2a] border border-[#1a2642] rounded-lg p-6 w-full max-w-lg relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
        
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Title</label>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#1e293b] text-white border border-[#2a3b52] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-[#1e293b] text-white border border-[#2a3b52] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {Object.keys(categories).map((key) => (
                <option key={key} value={key}>{categories[key].name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Content</label>
            <textarea
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-[#1e293b] text-white border border-[#2a3b52] rounded-lg h-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors disabled:bg-blue-900 disabled:text-blue-300"
            disabled={loading}
          >
            {loading ? "Creating Post..." : "Post"}
          </button>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [comment, setComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const userId = sessionStorage.getItem("mongoId"); // Logged-in user ID
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

  // Define categories with their styling
  const categories: { [key: string]: Category } = {
    "Education": {
      name: "Education",
      color: "text-blue-400",
      bgColor: "bg-[#121a2a]",
      borderColor: "border-[#1a2642]",
      hoverBorderColor: "hover:border-[#2a3c64]"
    },
    "Visa": {
      name: "Visa",
      color: "text-purple-400",
      bgColor: "bg-[#1a172a]",
      borderColor: "border-[#2a1a42]",
      hoverBorderColor: "hover:border-[#3a2a64]"
    },
    "Accommodation": {
      name: "Accommodation",
      color: "text-green-400",
      bgColor: "bg-[#122a1a]",
      borderColor: "border-[#1a4229]",
      hoverBorderColor: "hover:border-[#1a5236]"
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts when category changes
  useEffect(() => {
    if (activeCategory) {
      setFilteredPosts(posts.filter(post => post.category === activeCategory));
    } else {
      setFilteredPosts(posts);
    }
  }, [activeCategory, posts]);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/${postId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const updatedPost = await response.json();
      const newPosts = posts.map((post) => (post._id === postId ? updatedPost : post));
      setPosts(newPosts);
      
      // Update filtered posts as well
      setFilteredPosts(filteredPosts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!comment[postId]?.trim()) return;
    try {
      const response = await fetch(`${API_URL}/${postId}/comment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: comment[postId] }),
      });
      const updatedPost = await response.json();
      const newPosts = posts.map((post) => (post._id === postId ? updatedPost : post));
      setPosts(newPosts);
      
      // Update filtered posts as well
      setFilteredPosts(filteredPosts.map((post) => (post._id === postId ? updatedPost : post)));
      setComment({ ...comment, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReportComment = async (commentId: string, postId: string) => {
    try {
      const response = await fetch(`${API_URL}/${postId}/comment/${commentId}/report`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert("Comment reported successfully.");
      } else {
        console.error("Failed to report comment.");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const newPosts = posts.filter((post) => post._id !== postId);
        setPosts(newPosts);
        setFilteredPosts(filteredPosts.filter((post) => post._id !== postId));
      } else {
        console.error("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Filter posts by category
  const filterByCategory = (category: string | null) => {
    setActiveCategory(category);
  };

  // Get count of posts in each category
  const getCategoryCount = (categoryName: string) => {
    return posts.filter(post => post.category === categoryName).length;
  };

  // Format date to relative time
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    return `${Math.floor(diffSeconds / 604800)}w ago`;
  };

  // Function to get appropriate badge color based on category
  const getCategoryBadgeStyle = (category: string) => {
    switch(category) {
      case 'Education':
        return 'bg-blue-900 text-blue-400';
      case 'Visa':
        return 'bg-purple-900 text-purple-400';
      case 'Accommodation':
        return 'bg-green-900 text-green-400';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] bg-opacity-95 text-gray-300 pb-16 relative">
      {/* Background gradient/mesh effect */}
      <div className="absolute inset-0 bg-mesh-pattern opacity-20 pointer-events-none"></div>
      
      {/* Add Post Modal */}
      <AddPostModal 
        isOpen={isAddPostModalOpen} 
        onClose={() => {
          setIsAddPostModalOpen(false);
          fetchPosts(); // Refresh posts when modal is closed
        }}
        categories={categories}
      />
      
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
          Community Forum
        </h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          onClick={() => setIsAddPostModalOpen(true)}
        >
          <Edit size={18} />
          <span>New Post</span>
        </button>
      </header>

      {/* Forum categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {Object.entries(categories).map(([key, category]) => (
          <div 
            key={key}
            className={`${category.bgColor} rounded-lg p-4 border ${category.borderColor} ${category.hoverBorderColor} transition-colors cursor-pointer ${activeCategory === key ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => filterByCategory(activeCategory === key ? null : key)}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`${category.color} font-semibold`}>{category.name}</span>
              {activeCategory === key && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{getCategoryCount(key)} threads</p>
          </div>
        ))}
      </div>

      {/* Clear filter button */}
      {activeCategory && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <button 
            onClick={() => setActiveCategory(null)}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            <span>Clear filter</span> ({filteredPosts.length} results)
          </button>
        </div>
      )}

      {/* Post list */}
      <div className="max-w-5xl mx-auto px-6">
        {filteredPosts.length === 0 ? (
          // No posts message
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">
              {activeCategory ? `No posts found in ${activeCategory} category` : "No posts found"}
            </p>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)} 
                className="text-blue-500 hover:text-blue-400"
              >
                View all posts
              </button>
            )}
          </div>
        ) : (
          // Real posts from the API
          filteredPosts?.map((post) => (
            <div 
              key={post._id} 
              className={`rounded-lg p-6 mb-6 border hover:border-blue-900 transition-all duration-300 relative ${
                post.category === 'Visa' ? 'bg-[#1a172a] border-[#2a1a42]' :
                post.category === 'Accommodation' ? 'bg-[#122a1a] border-[#1a4229]' :
                'bg-[#121a2a] border-[#1a2642]'
              }`}
            >
              {/* Delete Button - Only visible to post owner */}
              {post?.user?._id === userId && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-[#1e293b]"
                >
                  <Trash2 size={16} />
                </button>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`${getCategoryBadgeStyle(post.category || '')} text-xs px-3 py-1 rounded-full`}>
                  {post.category || 'Uncategorized'}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.createdAt ? formatTimeAgo(post.createdAt) : ""}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                  {post?.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-medium text-gray-300">{post?.user?.name || "Unknown User"}</p>
                  <p className="text-xs text-gray-500">{post.updatedAt ? formatTimeAgo(post.updatedAt) : ""}</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">{post?.title || "Unknown"}</h2>
              <p className="text-gray-400 mb-4">{post?.content}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-[#1a2642]">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(post?._id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <ThumbsUp 
                      size={16} 
                      className={post?.likes?.includes(userId || "") ? "text-blue-500 fill-blue-500" : ""}
                    />
                    <span>{post?.likes?.length}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(post?._id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <MessageSquare size={16} />
                    <span>{post?.comments?.length} comments</span>
                  </button>
                </div>
              </div>
              
              {/* Comments Section */}
              {showComments[post?._id] && (
                <div className="mt-4 pt-4 border-t border-[#1a2642]">
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 bg-[#1e293b] text-gray-300 border border-[#2a3b52] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={comment[post?._id] || ""}
                        onChange={(e) => setComment({ ...comment, [post?._id]: e.target.value })}
                      />
                      <button 
                        onClick={() => handleAddComment(post?._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                  
                  {post?.comments.length > 0 ? (
                    <div className="space-y-3">
                      {post?.comments.map((c) => (
                        <div key={c._id} className="flex gap-2 bg-[#1e293b] p-3 rounded-lg">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0">
                            {c?.user?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-medium text-sm text-gray-300">
                                {c?.user?.name || "Anonymous"}
                              </p>
                              <button
                                onClick={() => handleReportComment(c._id, post._id)}
                                className="text-gray-600 hover:text-amber-500 transition-colors"
                              >
                                <Flag size={12} />
                              </button>
                            </div>
                            <p className="text-gray-400 text-sm">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-gray-500 text-sm">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;