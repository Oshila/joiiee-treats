'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Blogger',
    rating: 5,
    image: '/images/test01.jpg',
    quote: 'The loaded chocolate ice cream is absolutely divine! The perfect balance of rich chocolate and crunchy cookies.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    rating: 5,
    image: '/images/test02.jpg',
    quote: "Best ice cream in town! The Oreos & Cream is my go-to. Always fresh and creamy."
  },
  {
    id: 3,
    name: 'Amina Williams',
    role: 'Foodie',
    rating: 4,
    image: '/images/test03.jpg',
    quote: "I've tried them all and the Vanilla is simply perfect. Real vanilla flavor, not artificial."
  },
  {
    id: 4,
    name: 'David Okafor',
    role: 'Ice Cream Enthusiast',
    rating: 5,
    image: '/images/test04.jpg',
    quote: "The loaded chocolate is a game changer! Best ice cream I've ever had in Nigeria."
  },
  {
    id: 5,
    name: 'Chioma Eze',
    role: 'Food Critic',
    rating: 5,
    image: '/images/test05.jpg',
    quote: "Premium quality ice cream that rivals international brands. The Oreo flavor is outstanding!"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };
  
  // Get visible testimonials (3 at a time)
  const getVisibleTestimonials = () => {
    const items = [];
    const total = testimonials.length;
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % total;
      items.push({ ...testimonials[index], index });
    }
    return items;
  };
  
  const visibleItems = getVisibleTestimonials();
  
  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-white/80 text-pink-500 text-sm font-semibold rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            What Our <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-gray-500 mt-2">Real reviews from real customers</p>
        </motion.div>
        
        {/* Slideshow */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -ml-4 hidden sm:block"
          >
            <ChevronLeft size={24} className="text-pink-500" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -mr-4 hidden sm:block"
          >
            <ChevronRight size={24} className="text-pink-500" />
          </button>
          
          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {visibleItems.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => openModal(testimonial.image)}
              >
                {/* Customer Image */}
                <div className="relative h-64 bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Fallback emoji if image fails */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10 pointer-events-none">
                    👤
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Click to expand overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                      View Full Size
                    </span>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="p-5">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-xs text-pink-400">{testimonial.role}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    "{testimonial.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-pink-500 w-8'
                    : 'bg-pink-200 hover:bg-pink-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile Swipe Hint */}
        <p className="text-center text-xs text-gray-400 mt-4 sm:hidden">
          Tap on a photo to view full size • Swipe to see more
        </p>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-pink-400 transition-colors"
              >
                <X size={28} />
              </button>
              <img
                src={selectedImage}
                alt="Customer testimonial"
                className="w-full h-auto rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fce4e8"/><text x="200" y="200" font-size="100" text-anchor="middle" dy=".3em">👤</text></svg>';
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};