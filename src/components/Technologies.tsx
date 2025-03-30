
import React from 'react';
import { 
  Code, 
  Boxes, 
  PanelLeft, 
  LineChart, 
  Router, 
  Pencil, 
  ChartPie, 
  FileCode, 
  Database 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const Technologies = () => {
  const techStack = [
    { name: 'React', icon: <Boxes className="h-10 w-10 text-blue-500" /> },
    { name: 'TypeScript', icon: <FileCode className="h-10 w-10 text-blue-700" /> },
    { name: 'Vite', icon: <ChartPie className="h-10 w-10 text-purple-500" /> },
    { name: 'Tailwind CSS', icon: <PanelLeft className="h-10 w-10 text-sky-500" /> },
    { name: 'shadcn/ui', icon: <Code className="h-10 w-10 text-gray-700" /> },
    { name: 'Tanstack React Query', icon: <Database className="h-10 w-10 text-red-500" /> },
    { name: 'React Router DOM', icon: <Router className="h-10 w-10 text-pink-500" /> },
    { name: 'Lucide React', icon: <Pencil className="h-10 w-10 text-green-500" /> },
    { name: 'Recharts', icon: <LineChart className="h-10 w-10 text-yellow-500" /> },
    { name: 'WordPress', icon: <Code className="h-10 w-10 text-blue-600" /> }
  ];

  return (
    <section id="technologies" className="section-padding bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology Stack</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We leverage modern technologies to deliver high-quality websites and applications 
            tailored to your business needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {techStack.map((tech, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4">
                  {tech.icon}
                </div>
                <h3 className="font-medium text-center">{tech.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
