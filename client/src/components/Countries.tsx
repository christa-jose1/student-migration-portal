import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, Users, GraduationCap, TrendingUp } from 'lucide-react';

const Countries = () => {
  const navigate = useNavigate();
  
  const countries = [
    {
      name: 'United States',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      description: 'Leading destination for international students with diverse programs and opportunities.',
      stats: { universities: '4,000+', intlStudents: '1M+', ranking: '#1' },
      highlights: ['Optional Practical Training (OPT)', 'Diverse Campus Culture', 'Research Opportunities'],
      path: '/dashboard/usa'
    },
    {
      name: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      description: 'Rich academic heritage with world-renowned institutions and multicultural environment.',
      stats: { universities: '130+', intlStudents: '500K+', ranking: '#2' },
      highlights: ['Post-Study Work Visa', 'Historic Universities', 'English Language Benefits']
    },
    {
      name: 'Canada',
      image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225',
      description: 'Known for quality education, affordable tuition, and post-study work opportunities.',
      stats: { universities: '100+', intlStudents: '400K+', ranking: '#3' },
      highlights: ['Immigration Friendly', 'Work While Studying', 'Healthcare Benefits']
    },
    {
      name: 'Australia',
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
      description: 'High-quality education with excellent research facilities and student support.',
      stats: { universities: '43', intlStudents: '350K+', ranking: '#4' },
      highlights: ['Work Rights', 'Quality of Life', 'Scholarship Options']
    },
    {
      name: 'Germany',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
      description: 'Offers many English-taught programs with low or no tuition fees.',
      stats: { universities: '400+', intlStudents: '300K+', ranking: '#5' },
      highlights: ['Low Tuition Fees', 'Strong Economy', 'Rich Culture']
    }
  ];

  const handleCountryClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-xl mb-8">
        <h2 className="text-3xl font-bold mb-4">Popular Study Destinations</h2>
        <p className="text-lg opacity-90">Explore top countries offering world-class education and opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {countries.map((country) => (
          <div
            key={country.name}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            onClick={() => handleCountryClick(country.path)}
          >
            <div className="relative h-48">
              <img
                src={country.image}
                alt={country.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{country.name}</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">{country.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Universities</p>
                  <p className="font-bold text-blue-600">{country.stats.universities}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Int'l Students</p>
                  <p className="font-bold text-purple-600">{country.stats.intlStudents}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Global Rank</p>
                  <p className="font-bold text-indigo-600">{country.stats.ranking}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 mb-2">Key Highlights</h4>
                {country.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Countries;