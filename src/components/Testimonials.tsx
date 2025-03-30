import React, { useState, useEffect } from 'react';
import { Star, Quote, X, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [thumbnails, setThumbnails] = useState<{[key: string]: string}>({});
  
  // Mock testimonials
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
    {
      id: 4,
      name: 'Sunita Verma',
      position: 'Owner, Beauty Salon',
      content: 'Socilet created our business listings and improved our online presence dramatically. The results were visible within weeks with more customers finding our salon online.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
  ];

  // Video testimonials with YouTube shorts
  const videoTestimonials = [
    {
      id: 1,
      name: 'Kavita Singh',
      position: 'Owner, Wellness Center',
      videoId: 'Rz6PVUtVYks', 
    },
    {
      id: 2,
      name: 'Sudeshnaa',
      position: 'The Dietitian',
      videoId: '4oogYX-_a38',
    },
    {
      id: 3,
      name: 'Meena Reddy',
      position: 'Director, Education First',
      videoId: 'g57bSleJEEY', 
    },
    {
      id: 4,
      name: 'Rahul Desai',
      position: 'Startup Founder',
      videoId: '_8s-7gSdT5E',
    },
    {
      id: 5,
      name: 'Ananya Joshi',
      position: 'Marketing Consultant',
      videoId: '_A-NDWDF9aE',
    },
  ];

  // Fetch YouTube thumbnails when component mounts
  useEffect(() => {
    const fetchThumbnails = async () => {
      const thumbnailData: {[key: string]: string} = {};
      
      for (const video of videoTestimonials) {
        // YouTube thumbnail URL format
        thumbnailData[video.videoId] = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
      }
      
      setThumbnails(thumbnailData);
    };
    
    fetchThumbnails();
  }, []);

  // Function to play video
  const playVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setVideoOpen(true);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-gray-50 relative py-20">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold mb-2 text-primary-800">Client Testimonials</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Don't just take our word for it. See what our clients have to say about our work and 
            our unique zero advance payment model.
          </p>
        </motion.div>

        <div className="mb-20 overflow-hidden">
          <Carousel 
            className="w-full" 
            opts={{ 
              loop: true 
            }}
          >
            <CarouselContent>
              {testimonials.map(testimonial => (
                <CarouselItem key={testimonial.id} className="md:basis-1/3 pl-4">
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)" }}
                  >
                    <Quote className="w-10 h-10 text-primary-100 absolute top-4 right-4 opacity-40" />
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic flex-grow">&quot;{testimonial.content}&quot;</p>
                    <div className="flex items-center mt-auto">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-100 mr-4 shadow-sm">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static transform-none mx-2" />
              <CarouselNext className="static transform-none mx-2" />
            </div>
          </Carousel>
        </div>

        {/* YouTube Video Testimonials Section */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="text-2xl font-bold mb-4 text-primary-700">Video Testimonials</h3>
          <p className="text-gray-600 mb-8">
            Watch our clients share their experiences with our services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {videoTestimonials.map((video) => (
            <motion.div
              key={video.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: video.id * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-none shadow-lg h-full">
                <CardContent className="p-0 relative">
                  <div 
                    className="relative aspect-[9/16] overflow-hidden"
                    onClick={() => playVideo(video.videoId)}
                  >
                    {thumbnails[video.videoId] ? (
                      <img 
                        src={thumbnails[video.videoId]} 
                        alt={video.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <Youtube className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-medium rounded-lg px-2 py-1 flex items-center">
                        <Youtube className="h-3 w-3 mr-1" />
                        <span>Shorts</span>
                      </div>
                      
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400, 
                          damping: 10,
                          duration: 0.3
                        }}
                      >
                        <Youtube className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="p-4 text-center">
                    <h4 className="font-bold text-primary-800">{video.name}</h4>
                    <p className="text-sm text-gray-500">{video.position}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-gradient-to-r from-primary-50 to-white px-8 py-4 rounded-full shadow-md border border-primary-100">
            <p className="text-primary-800 font-medium text-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
              <span>900+ completed projects with 100% client satisfaction</span>
              <Star className="w-5 h-5 text-yellow-400 fill-current ml-2" />
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video dialog for YouTube shorts */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[360px] p-0 bg-black overflow-hidden h-[80vh] max-h-[80vh]">
          <div className="relative w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <DialogClose className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-50">
            <X className="h-6 w-6" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Testimonials;
