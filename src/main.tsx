import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './hideLovable.css';
import { AuthProvider } from "@/hooks/useAuth";

// Function to ensure verification meta tags are always present
const ensureVerificationTags = () => {
  const criticalMetaTags = [
    { name: 'msvalidate.01', content: 'F369CBC92F03EBB72A41A8782CB42881' },
    { name: 'google-site-verification', content: '9-T-e6qKoCEslMvWnfKDeXadkedKtT_DtKhdPKPKyjY' }
  ];
  
  if (!document.head) return;
  
  criticalMetaTags.forEach(metaData => {
    let metaTag = document.querySelector(`meta[name="${metaData.name}"]`);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', metaData.name);
      metaTag.setAttribute('content', metaData.content);
      document.head.insertBefore(metaTag, document.head.firstChild);
    } else if (metaTag.getAttribute('content') !== metaData.content) {
      metaTag.setAttribute('content', metaData.content);
    }
  });
};

// Function to handle site versioning
const handleSiteVersioning = () => {
  if (!localStorage.getItem('site-version')) {
    localStorage.setItem('site-version', new Date().getTime().toString());
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const cacheRefresh = urlParams.get('refresh-cache');
  
  if (cacheRefresh === 'true') {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    Object.keys(localStorage).forEach(key => {
      if (key !== 'site-version' && !key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    const siteVersion = localStorage.getItem('site-version');
    if (siteVersion) {
      localStorage.setItem('current-site-version', siteVersion);
    }
    
    window.sessionStorage.setItem('force-reload-assets', 'true');
    
    urlParams.delete('refresh-cache');
    const newUrl = window.location.pathname + 
                   (urlParams.toString() ? '?' + urlParams.toString() : '') + 
                   window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
};

// Initialize verification tags once
ensureVerificationTags();
handleSiteVersioning();

// Initialize React app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}
