
import React from 'react';
import GoogleVerificationManager from './webmaster/GoogleVerificationManager';
import CacheManager from './webmaster/CacheManager';
import PasswordManager from './webmaster/PasswordManager';
import OtherSettingsCard from './webmaster/OtherSettingsCard';

const WebmasterManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Webmaster Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Search Console Card */}
        <GoogleVerificationManager />
        
        <CacheManager />
        
        <PasswordManager />
        
        <OtherSettingsCard />
      </div>
    </div>
  );
};

export default WebmasterManager;
