
import React from 'react';
import { Star, Play } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Testimonials = () => {
  // Mock testimonials - in a real scenario, these would come from your backend
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      position: 'CEO, TechSolutions',
      content: 'Working with Socilet was a game-changer for our business. Their zero advance payment model gave us confidence, and they delivered beyond our expectations.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      position: 'Founder, StyleHub',
      content: 'I was skeptical about the "work first, pay later" model, but Socilet proved their commitment with exceptional work. My e-commerce website is performing brilliantly!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Amit Patel',
      position: 'Marketing Director, FoodDelight',
      content: 'The team at Socilet developed our restaurant app with great attention to detail. The work first model was perfect for us as a startup with budget constraints.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
  ];

  // Mock video testimonials - updated for portrait orientation
  const videoTestimonials = [
    {
      id: 1,
      name: 'Kavita Singh',
      position: 'Owner, Wellness Center',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=600',
    },
    {
      id: 2,
      name: 'Vikram Mehta',
      position: 'CEO, BuildRight Construction',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=600',
    },
  ];

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary-800">Client Testimonials</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Don't just take our word for it. See what our clients have to say about our work and 
            our unique zero advance payment model.
          </p>
        </div>

        <div className="mb-20">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map(testimonial => (
                <CarouselItem key={testimonial.id} className="md:basis-1/3 pl-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic flex-grow">&quot;{testimonial.content}&quot;</p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-primary-100" 
                      />
                      <div>
                        <h4 className="font-bold text-primary-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static transform-none mx-2" />
              <CarouselNext className="static transform-none mx-2" />
            </div>
          </Carousel>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-bold mb-4 text-primary-700">Video Testimonials</h3>
          <p className="text-gray-600 mb-8">
            Watch what our clients have to say about their experience working with Socilet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videoTestimonials.map(video => (
            <div key={video.id} className="relative group cursor-pointer mx-auto">
              <div className="overflow-hidden rounded-xl w-64 h-96 mx-auto">
                <img 
                  src={video.thumbnail} 
                  alt={video.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary-600 bg-opacity-90 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-bold text-primary-700">{video.name}</h4>
                <p className="text-sm text-gray-500">{video.position}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block bg-primary-50 px-8 py-4 rounded-full shadow-sm">
            <p className="text-primary-800 font-medium text-lg">
              900+ completed projects with 100% client satisfaction
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
