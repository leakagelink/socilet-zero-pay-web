
import React from 'react';

type PriceCardProps = {
  title: string;
  price: string;
  features: string[];
};

const PriceCard = ({ title, price, features }: PriceCardProps) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-medium">{title}</h3>
    <p className="text-xl font-bold my-2">{price}</p>
    <ul className="text-sm space-y-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default PriceCard;
