
import React from 'react';
import GoogleVerificationManager from './webmaster/GoogleVerificationManager';
import CacheManager from './webmaster/CacheManager';
import PasswordManager from './webmaster/PasswordManager';
import OtherSettingsCard from './webmaster/OtherSettingsCard';
import BingVerificationManager from './webmaster/BingVerificationManager';
import YandexVerificationManager from './webmaster/YandexVerificationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from 'sonner';

const WebmasterManager = () => {
  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      <h2 className="text-2xl font-bold">Webmaster Tools</h2>
      
      <Tabs defaultValue="google" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="google">Google Search Console</TabsTrigger>
          <TabsTrigger value="bing">Bing Webmaster</TabsTrigger>
          <TabsTrigger value="yandex">Yandex Webmaster</TabsTrigger>
          <TabsTrigger value="other">Other Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google">
          <GoogleVerificationManager />
        </TabsContent>
        
        <TabsContent value="bing">
          <BingVerificationManager />
        </TabsContent>
        
        <TabsContent value="yandex">
          <YandexVerificationManager />
        </TabsContent>
        
        <TabsContent value="other">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CacheManager />
            <PasswordManager />
            <OtherSettingsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebmasterManager;
