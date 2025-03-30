
import React from 'react';
import { Code, Smartphone, Video, Globe, Check } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Code className="w-12 h-12 text-primary-600" />,
      title: 'Website Development',
      description: 'Custom website development with responsive design and modern UI/UX practices.',
      features: ['Custom Design', 'Responsive Layout', 'SEO Optimized', 'Fast Loading']
    },
    {
      icon: <Smartphone className="w-12 h-12 text-primary-600" />,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: ['Native & Cross-platform', 'User-friendly UI', 'Performance Optimized', 'Ongoing Support']
    },
    {
      icon: <Video className="w-12 h-12 text-primary-600" />,
      title: 'AI Spokesperson',
      description: 'Create virtual presenters and spokespersons powered by AI for your marketing needs.',
      features: ['Customizable Avatar', 'Natural Speech', 'Multiple Languages', 'Easy Integration']
    },
    {
      icon: <Globe className="w-12 h-12 text-primary-600" />,
      title: 'Business Profile Listing',
      description: 'Get your business listed across major platforms to increase visibility and reach.',
      features: ['Google My Business', 'Local Directories', 'Social Platforms', 'Industry Specific']
    }
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">
            We offer a range of digital services with our unique zero advance payment model. 
            Pay only after your project is successfully delivered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary-50 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Zero Advance Payment Model</h3>
              <p className="text-gray-600 max-w-xl">
                We believe in our work quality. That's why we only charge after project completion and your satisfaction.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-100">
              <p className="text-lg font-medium text-primary-800">
                No advance payment required!
              </p>
              <p className="text-sm text-gray-500">
                No hidden charges, pay only when satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
