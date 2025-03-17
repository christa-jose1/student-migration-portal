import { HomeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PencilSquareIcon, ChatBubbleLeftIcon, UserCircleIcon, HandThumbUpIcon, PaperAirplaneIcon, XMarkIcon, ShareIcon, BookmarkIcon} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';


interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  hasUserLiked: boolean;
}

interface Thread {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  comments: Comment[];
  likes: number;
  timestamp: string;
  hasUserLiked: boolean;
  showComments: boolean;
  isBookmarked: boolean;
}

interface Category {
  name: string;
  slug: string;
  color: string;
  icon: JSX.Element;
}

export default function Forum() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: 'study-advice', content: '' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      title: 'Best universities for Computer Science in Germany',
      author: 'TechStudent22',
      category: 'study-advice',
      content: 'Looking for recommendations for top CS programs in Germany. Particularly interested in universities with strong AI/ML research programs.',
      comments: [
        { 
          id: 1, 
          author: 'Prof123', 
          content: 'TU Munich has an excellent CS program with strong AI focus!', 
          timestamp: '1h ago',
          likes: 5,
          hasUserLiked: false
        }
      ],
      likes: 42,
      timestamp: '2h ago',
      hasUserLiked: false,
      showComments: false,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'Visa application timeline experiences',
      author: 'FutureStudentCA',
      category: 'visa-immigration',
      content: 'How long did your student visa process take? Planning to apply for the winter semester.',
      comments: [],
      likes: 27,
      timestamp: '5h ago',
      hasUserLiked: false,
      showComments: false,
      isBookmarked: false
    }
  ]);

  const categories: Category[] = [
    { 
      name: 'Study Advice', 
      slug: 'study-advice', 
      color: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400',
      icon: <ChatBubbleLeftIcon className="w-6 h-6" />
    },
    { 
      name: 'Visa & Immigration', 
      slug: 'visa-immigration', 
      color: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400',
      icon: <UserCircleIcon className="w-6 h-6" />
    },
    { 
      name: 'Accommodation', 
      slug: 'accommodation', 
      color: 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400',
      icon: <HomeIcon className="w-6 h-6" />
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newThread: Thread = {
      id: threads.length + 1,
      title: newPost.title,
      author: 'CurrentUser',
      category: newPost.category,
      content: newPost.content,
      comments: [],
      likes: 0,
      timestamp: 'Just now',
      hasUserLiked: false,
      showComments: false,
      isBookmarked: false
    };
    setThreads([newThread, ...threads]);
    setShowNewPost(false);
    setNewPost({ title: '', category: 'study-advice', content: '' });
  };

  const handleThreadLike = (threadId: number) => {
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? { 
            ...thread, 
            likes: thread.hasUserLiked ? thread.likes - 1 : thread.likes + 1,
            hasUserLiked: !thread.hasUserLiked 
          } 
        : thread
    ));
  };

  const handleBookmark = (threadId: number) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? { ...thread, isBookmarked: !thread.isBookmarked }
        : thread
    ));
  };

  const handleCommentLike = (threadId: number, commentId: number) => {
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? {
            ...thread,
            comments: thread.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.hasUserLiked ? comment.likes - 1 : comment.likes + 1,
                    hasUserLiked: !comment.hasUserLiked
                  }
                : comment
            )
          }
        : thread
    ));
  };

  const toggleComments = (threadId: number) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? { ...thread, showComments: !thread.showComments }
        : thread
    ));
  };

  const handleComment = (threadId: number) => {
    if (!newComment.trim()) return;
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? {
            ...thread,
            comments: [
              ...thread.comments,
              {
                id: thread.comments.length + 1,
                author: 'CurrentUser',
                content: newComment,
                timestamp: 'Just now',
                likes: 0,
                hasUserLiked: false
              }
            ]
          }
        : thread
    ));
    setNewComment('');
  };

  const filteredThreads = selectedCategory 
    ? threads.filter(thread => thread.category === selectedCategory)
    : threads;

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 text-gray-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold animate-text bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <button
            onClick={() => setShowNewPost(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            <PencilSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(category => (
            <button 
              key={category.slug}
              onClick={() => setSelectedCategory(
                selectedCategory === category.slug ? null : category.slug
              )}
              className={`${category.color} p-6 rounded-xl flex items-center gap-4 border ${
                selectedCategory === category.slug 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105' 
                  : 'border-gray-800 hover:border-blue-500/50 hover:scale-102'
              } transition-all duration-300 backdrop-blur-sm group hover:shadow-lg`}
            >
              <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {threads.filter(t => t.category === category.slug).length} threads
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredThreads.map(thread => (
            <div 
              key={thread.id}
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => handleThreadLike(thread.id)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                      thread.hasUserLiked 
                        ? 'bg-blue-500/20 text-blue-500 scale-110' 
                        : 'hover:bg-blue-500/10 text-gray-400 hover:text-blue-400'
                    }`}
                  >
                    {thread.hasUserLiked ? (
                      <HandThumbUpIconSolid className="w-6 h-6" />
                    ) : (
                      <HandThumbUpIcon className="w-6 h-6" />
                    )}
                  </button>
                  <span className={`text-sm font-medium ${
                    thread.hasUserLiked ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {thread.likes}
                  </span>
                  
                  <button 
                    onClick={() => handleBookmark(thread.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                      thread.isBookmarked 
                        ? 'text-yellow-500' 
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    {thread.isBookmarked ? (
                      <BookmarkIconSolid className="w-5 h-5" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border border-gray-700/50 ${
                      categories.find(c => c.slug === thread.category)?.color
                    }`}>
                      {categories.find(c => c.slug === thread.category)?.name}
                    </span>
                    <span className="text-sm text-gray-400">{thread.timestamp}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100 hover:text-blue-400 transition-colors">
                    {thread.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{thread.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <UserCircleIcon className="w-5 h-5" />
                      <span className="hover:text-blue-400 transition-colors">{thread.author}</span>
                    </div>
                    <button 
                      onClick={() => toggleComments(thread.id)}
                      className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span>{thread.comments.length} comments</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {thread.showComments && (
                    <div className="mt-6 space-y-4">
                      {thread.comments.map(comment => (
                        <div 
                          key={comment.id} 
                          className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <UserCircleIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-200">{comment.author}</span>
                              <span className="text-sm text-gray-500">{comment.timestamp}</span>
                            </div>
                            <button
                              onClick={() => handleCommentLike(thread.id, comment.id)}
                              className={`flex items-center gap-1 text-sm ${
                                comment.hasUserLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
                              } transition-colors`}
                            >
                              {comment.hasUserLiked ? (
                                <HandThumbUpIconSolid className="w-4 h-4" />
                              ) : (
                                <HandThumbUpIcon className="w-4 h-4" />
                              )}
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                          <p className="text-gray-200">{comment.content}</p>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 bg-gray-700/30 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                        />
                        <button
                          onClick={() => handleComment(thread.id)}
                          disabled={!newComment.trim()}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showNewPost && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-2xl border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create New Post
                </h2>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                  <select
                    className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Content</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewPost(false)}
                    className="px-6 py-3 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}