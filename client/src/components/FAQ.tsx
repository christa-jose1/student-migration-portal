import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

interface FAQItem {
  _id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing FAQ
  const [editingFAQ, setEditingFAQ] = useState<number | null>(null);
  const [updatedFAQ, setUpdatedFAQ] = useState<{
    question: string;
    answer: string;
  }>({
    question: "",
    answer: "",
  });

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get<FAQItem[]>(
          "http://localhost:5000/api/faqs"
        ); // Adjust API URL as needed
        setFaqItems(response.data);
      } catch (err) {
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setActiveFAQ((prev) => (prev === id ? null : id));
  };

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery, faqItems]);

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find detailed answers to common questions about student migration
            and our services.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Search questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No matching questions found. Try a different search term.
              </p>
            </div>
          ) : (
            filteredFAQs.map((item) => (
              <div
                key={item._id}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-700/50 hover:border-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <button
                  onClick={() => toggleFAQ(item._id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center relative z-10"
                >
                  <span className="text-lg font-medium text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
                    {item.question}
                  </span>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                    activeFAQ === item._id
                      ? "max-h-[500px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {editingFAQ === item._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={updatedFAQ.question}
                        onChange={(e) =>
                          setUpdatedFAQ({
                            ...updatedFAQ,
                            question: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded"
                      />
                      <textarea
                        value={updatedFAQ.answer}
                        onChange={(e) =>
                          setUpdatedFAQ({
                            ...updatedFAQ,
                            answer: e.target.value,
                          })
                        }
                        className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveClick(item._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFAQ(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
