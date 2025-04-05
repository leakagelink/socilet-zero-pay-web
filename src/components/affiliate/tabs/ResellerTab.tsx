
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Info, 
  Download,
  DollarSign
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const ResellerTab = () => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    // In a real app, this would download a PDF or excel file
    toast({
      title: "Price List",
      description: "The price list will be available for download soon.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" /> Reseller Program
          </CardTitle>
          <CardDescription>
            Sell our services under your brand at your own prices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" /> How It Works
            </h3>
            <p className="text-sm">
              As a reseller, you can market our services under your own brand and set your own prices. 
              You purchase at our wholesale rates and keep the margin instead of earning commission.
              This allows for potentially higher profits and more control over your business.
            </p>
          </div>
          
          <h3 className="font-medium text-lg mt-4">Our Wholesale Prices (Your Cost)</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Website Development</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">₹15,000</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Responsive design
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Up to 5 pages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Contact form
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    SEO basics
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">E-commerce Website</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">₹30,000</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Product management
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Payment integration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Up to 50 products
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Order management
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mobile App Development</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">₹40,000</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    iOS & Android
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    User authentication
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Custom design
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Basic features
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">SEO Package</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">₹10,000</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Keyword research
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    On-page optimization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Content suggestions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                    Monthly report
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Example Profit Margins
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you sell a Website Development package for ₹25,000 (your cost: ₹15,000), you keep 
              ₹10,000 profit instead of earning just ₹6,250 (25% commission).
            </p>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Complete Price List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerTab;
