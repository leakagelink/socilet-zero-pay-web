
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const OtherSettingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Other Settings
        </CardTitle>
        <CardDescription>Additional webmaster settings and tools</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Advanced settings for website maintenance and optimization.
          (More features coming soon)
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" disabled>Manage Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default OtherSettingsCard;
