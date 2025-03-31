import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

interface FAQItem {
  _id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
    // const faqItems: FAQItem[] = [
  //   {
  //     id: 1,
  //     question: 'How does EduConnect help with visa processing?',
  //     answer:
  //       'We provide end-to-end visa assistance including document preparation, application submission, and interview preparation. Our expert consultants guide you through each step of the process, ensuring all requirements are met and increasing your chances of visa approval.',
  //     category: 'Visa'
  //   },
  //   {
  //     id: 2,
  //     question: 'What documents are typically required for student migration?',
  //     answer:
  //       'Common required documents include: academic transcripts, standardized test scores (IELTS/TOEFL), financial statements showing sufficient funds, valid passport, statement of purpose, letters of recommendation, health insurance documentation, and proof of accommodation arrangements.',
  //     category: 'Documentation'
  //   },
  //   {
  //     id: 3,
  //     question: 'What are the average living costs for international students?',
  //     answer:
  //       'Living costs vary by country and city. On average, students should budget for: Accommodation ($500-1200/month), Food ($200-400/month), Transport ($50-100/month), Utilities ($100-200/month), and Personal expenses ($200-300/month). We recommend having additional emergency funds.',
  //     category: 'Finance'
  //   },
  //   {
  //     id: 4,
  //     question: 'How long does the visa processing typically take?',
  //     answer:
  //       'Visa processing times vary by country but typically range from 2-12 weeks. Premium processing options may be available for some countries. We recommend starting the visa application process at least 3-4 months before your intended travel date.',
  //     category: 'Visa'
  //   },
  //   {
  //     id: 5,
  //     question: 'What accommodation options are available for international students?',
  //     answer:
  //       'Students can choose from: University dormitories, Private student housing, Shared apartments, Homestays with local families, or Private rentals. Each option has different costs and benefits. We can help you evaluate and secure the best option for your needs and budget.',
  //     category: 'Accommodation'
  //   },
  //   {
  //     id: 6,
  //     question: 'Can I work while studying abroad?',
  //     answer:
  //       'Work regulations vary by country. Many student visas allow part-time work (usually 20 hours/week) during term and full-time during holidays. Some countries require additional work permits. We can provide detailed information specific to your destination country.',
  //     category: 'General'
  //   },
  //   {
  //     id: 7,
  //     question: 'What healthcare arrangements do I need to make?',
  //     answer:
  //       'Most countries require international students to have comprehensive health insurance. Some universities provide their own health coverage, while others require you to arrange private insurance. We can help you understand the requirements and find suitable coverage options.',
  //     category: 'General'
  //   },
  //   {
  //     id: 8,
  //     question: 'How can I prepare for the visa interview?',
  //     answer:
  //       'We provide comprehensive interview preparation including: mock interviews, common question preparation, document organization guidance, and tips on professional presentation. We also help you understand the specific requirements and expectations of your destination country embassy.',
  //     category: 'Visa'
  //   }
  // ];
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faqs'); // Adjust API URL as needed
        setFaqItems(response.data);
      } catch (err) {
        setError('Failed to load FAQs');
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
    return faqItems.filter((item) =>
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
            Find detailed answers to common questions about student migration and our services.
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
                  onClick={() => setActiveFAQ(activeFAQ === item._id ? null : item._id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center relative z-10"
                >
                  <span className="text-lg font-medium text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
                    {item.question}
                  </span>
                  <span
                    className={`transform transition-transform duration-300 text-blue-400 ${
                      activeFAQ === item._id ? 'rotate-180' : ''
                    }`}
                  >
                  </span>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                    activeFAQ === item._id ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
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