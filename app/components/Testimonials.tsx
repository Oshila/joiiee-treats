'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Blogger',
    content: 'The loaded chocolate ice cream is absolutely divine! The perfect balance of rich chocolate and crunchy cookies.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=d4697a&color=fff'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    content: "Best ice cream in town! The Oreos & Cream is my go-to. Always fresh and creamy.",
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=d4697a&color=fff'
  },
  {
    id: 3,
    name: 'Amina Williams',
    role: 'Foodie',
    content: "I've tried them all and the Vanilla is simply perfect. Real vanilla flavor, not artificial.",
    rating: 4,
    avatar: 'https://ui-avatars.com/api/?name=Amina+Williams&background=d4697a&color=fff'
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          
            Testimonials<span className="inline-block px-4 py-1.5 bg-[rgba(255,255,255,0.8)] text-pink-500 text-sm font-semibold rounded-full mb-4">
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            What Our <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Customers Say</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(255,255,255,0.8)] backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-xs text-pink-400">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mt-3">
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
              
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};