import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TypingText: React.FC<{ text: string; speed?: number; blink?: boolean }> = ({
  text,
  speed = 30,
  blink = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex++;
      if (currentIndex >= text.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="relative text-white text-lg md:text-2xl font-light leading-relaxed max-w-4xl mx-auto text-center px-6 md:px-12">
      {displayedText}
      {blink && (
        <span
          className={`border-r-2 border-blue-400 ml-1 inline-block ${
            isTypingComplete ? 'animate-blink' : 'animate-pulse'
          }`}
        />
      )}
    </p>
  );
};

const Home: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const navigate = useNavigate();

  const cards = [
    {
      number: '01',
      title: 'United States',
      image:
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&h=1200&q=80',
      theme: 'cosmic',
      path: '/dashboard/usa',
    },
    {
      number: '02',
      title: 'United Kingdom',
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&h=1200&q=80',
      theme: 'nebula',
      path: '/dashboard/uk',
    },
    {
      number: '03',
      title: 'Canada',
      image:
        'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&h=1200&q=80',
      theme: 'galaxy',
      path: '/dashboard/canada',
    },
    {
      number: '04',
      title: 'Australia',
      image:
        'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&h=1200&q=80',
      theme: 'aurora',
      path: '/dashboard/australia',
    },
    {
      number: '05',
      title: 'Germany',
      image:
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&h=1200&q=80',
      theme: 'modern',
      path: '/dashboard/germany',
    },
  ];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const getVisibleCards = () => {
    const visibleIndices = [];
    for (let i = -1; i < 3; i++) {
      visibleIndices.push((currentCardIndex + i + cards.length) % cards.length);
    }
    return visibleIndices;
  };

  const handleCardClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  const getCardTheme = (theme: string) => {
    switch (theme) {
      case 'cosmic':
        return 'bg-gradient-to-t from-blue-900/50 via-indigo-900/25 to-black/10';
      case 'nebula':
        return 'bg-gradient-to-t from-purple-900/50 via-blue-900/25 to-black/10';
      case 'galaxy':
        return 'bg-gradient-to-t from-indigo-900/50 via-blue-900/25 to-black/10';
      case 'aurora':
        return 'bg-gradient-to-t from-blue-900/50 via-purple-900/25 to-black/10';
      default:
        return 'bg-gradient-to-t from-blue-900/50 via-purple-900/25 to-black/10';
    }
  };

  return (
    <div className="relative bg-transparent min-h-screen">
      <style>{`
        @keyframes zoom {
          from { background-size: 40%; }
          to { background-size: 10%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>

      <div className="w-full flex justify-center items-center pt-16 z-30 relative">
        <h1
          className="font-brainbridg uppercase tracking-widest drop-shadow-2xl px-8 py-4 relative"
          style={{
            backgroundImage:
              'url(https://wallpapers.com/images/hd/college-graduation-pictures-bkjadfrg7up3uydl.jpg)',
            backgroundSize: '40%',
            backgroundPosition: '50% 50%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'zoom 10s ease forwards',
            fontSize: '10vw',
          }}
        >
          BRAINBRIDG
          <span className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-blue-500/60 to-transparent blur-2xl" />
          <span className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-blue-500/60 to-transparent blur-2xl" />
        </h1>
      </div>

      <div className="w-full px-6 md:px-12 text-center mt-12 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className="w-full"
        >
          <TypingText
            text="We believe every student deserves the chance to broaden their horizons through international education. Whether you’re dreaming of studying in the United States, the United Kingdom, Canada, Australia, Germany, or beyond, our dedicated team is here to help you every step of the way."
            speed={50}
            blink
          />
        </motion.div>
      </div>

      <div className="space-y-12 pt-16">
        <div className="relative h-[700px] overflow-hidden perspective-1000 bg-transparent">
          <div className="max-w-7xl mx-auto relative h-full bg-transparent">
            <button
              onClick={prevCard}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/10 hover:bg-blue-500/20 rounded-full flex items-center justify-center transition-all duration-300 z-30 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 group"
            >
              <ChevronLeft className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
            </button>
            <button
              onClick={nextCard}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/10 hover:bg-blue-500/20 rounded-full flex items-center justify-center transition-all duration-300 z-30 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 group"
            >
              <ChevronRight className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
            </button>

            <div className="relative h-full flex items-center justify-center">
              {getVisibleCards().map((index, position) => {
                const card = cards[index];
                let translateX = '0%';
                let translateZ = '0px';
                let rotateY = '0deg';
                let scale = '1';
                let zIndex = 20;
                let opacity = 1;

                if (position === 0) {
                  translateX = '-90%';
                  translateZ = '-200px';
                  rotateY = '45deg';
                  scale = '0.8';
                  zIndex = 10;
                  opacity = 0.6;
                } else if (position === 2) {
                  translateX = '90%';
                  translateZ = '-200px';
                  rotateY = '-45deg';
                  scale = '0.8';
                  zIndex = 10;
                  opacity = 0.6;
                } else if (position === 3) {
                  translateX = '180%';
                  translateZ = '-400px';
                  rotateY = '-60deg';
                  scale = '0.6';
                  zIndex = 5;
                  opacity = 0.3;
                }

                return (
                  <div
                    key={card.number}
                    className="absolute w-[400px] h-[600px] transition-all duration-700"
                    style={{
                      transform: `translate3d(${translateX}, 0, ${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                  >
                    <div
                      className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 group shadow-lg shadow-blue-500/10 ${
                        card.path ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => handleCardClick(card.path)}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 ${getCardTheme(card.theme)}`} />
                      <div className="absolute top-6 left-6">
                        <span className="text-6xl font-bold text-white/80">{card.number}</span>
                      </div>
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-3xl font-bold text-white tracking-wider font-serif">{card.title}</h3>
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className="text-white/80 text-2xl transform rotate-45 inline-block transition-transform group-hover:rotate-90">↗</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;