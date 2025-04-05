
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import PriceCard from '../ui/PriceCard';

const ResellerTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reseller Program</CardTitle>
        <CardDescription>
          Sell our services at your own price
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" /> How It Works
          </h3>
          <p className="text-sm">
            As a reseller, you can market our services under your own brand and set your own prices. Instead of earning 25% commission, you keep the difference between our price and your selling price.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Our Service Prices (Your Cost):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PriceCard 
              title="Website Development" 
              price="₹15,000" 
              features={["Custom design", "Mobile responsive", "5 pages"]} 
            />
            <PriceCard 
              title="E-commerce Website" 
              price="₹30,000" 
              features={["Product management", "Payment integration", "10 pages"]} 
            />
            <PriceCard 
              title="Mobile App Development" 
              price="₹40,000" 
              features={["iOS & Android", "User authentication", "Basic features"]} 
            />
            <PriceCard 
              title="SEO Package" 
              price="₹10,000" 
              features={["Keyword research", "On-page optimization", "Monthly report"]} 
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Example Markup:</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you sell a Website Development package for ₹25,000 (your cost: ₹15,000), you keep ₹10,000 profit instead of earning just ₹3,750 (25% commission).
          </p>
          
          <Button variant="outline">
            Download Price List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResellerTab;
