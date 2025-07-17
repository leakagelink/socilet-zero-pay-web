
import React from 'react';
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TeamShowcase = () => {
  const teamImages = [
    {
      id: 1,
      url: "/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png",
      title: "SEO Expert",
      description: "Our SEO specialist optimizing your digital presence"
    },
    {
      id: 2,
      url: "/lovable-uploads/5800f243-20d8-4672-b941-b0b53752f294.png",
      title: "App Developer",
      description: "Expert mobile app developer creating innovative solutions"
    },
    {
      id: 3,
      url: "/lovable-uploads/4d1b600f-6762-416e-8778-c3d2777a5d54.png",
      title: "Social Media Manager",
      description: "Managing your brand's social media presence"
    },
    {
      id: 4,
      url: "/lovable-uploads/136bb329-dddb-471c-90e4-a91b112cdacf.png",
      title: "Web Designer",
      description: "Creating beautiful and functional web designs"
    },
    {
      id: 5,
      url: "/lovable-uploads/30524eb0-f4b1-469b-af5f-cf1018d53167.png",
      title: "Socilet Team",
      description: "Our dedicated team working to brand your dreams"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our skilled professionals are dedicated to bringing your digital dreams to life with expertise and innovation.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            autoplayOptions={{
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {teamImages.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <motion.div 
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover-card"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-primary-800 mb-2">
                          {image.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {image.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-primary-600 font-medium">
            ✨ Our team is ready to transform your ideas into reality
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;
