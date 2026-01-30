import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './hideLovable.css';
import { AuthProvider } from "@/hooks/useAuth";

// Remove any existing unwanted elements
const removeUnwantedElements = () => {
  // Find and remove any scripts related to unwanted platforms
  document.querySelectorAll('script').forEach(script => {
    if (script.src.includes('lovable') || 
        script.src.includes('gpteng') || 
        script.innerHTML.includes('lovable') || 
        script.innerHTML.includes('gpteng') ||
        script.src.includes('gptengineer')) {
      script.remove();
    }
  });

  // Find and remove any dynamic elements related to unwanted platforms
  document.querySelectorAll('div').forEach(div => {
    if ((div.id && (div.id.includes('lovable') || div.id.includes('gpteng'))) || 
        (div.className && (div.className.includes('lovable') || div.className.includes('gpteng'))) ||
        (div.hasAttribute('data-lovable-id'))) {
      div.remove();
    }
  });

  // Remove any fixed position elements that might be popups
  document.querySelectorAll('div[style*="position: fixed"]').forEach(div => {
    if (!div.id || (div.id !== 'root' && !div.closest('#root'))) {
      div.remove();
    }
  });
};

// Function to ensure verification meta tags are always present and in the correct position
const ensureVerificationTags = () => {
  // Critical verification tags that must always be present
  const criticalMetaTags = [
    {
      name: 'msvalidate.01',
      content: 'F369CBC92F03EBB72A41A8782CB42881'
    },
    {
      name: 'google-site-verification',
      content: '9-T-e6qKoCEslMvWnfKDeXadkedKtT_DtKhdPKPKyjY'
    }
  ];
  
  // Ensure the head element exists
  if (!document.head) {
    return;
  }
  
  // Add any missing critical meta tags
  criticalMetaTags.forEach(metaData => {
    let metaTag = document.querySelector(`meta[name="${metaData.name}"]`);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', metaData.name);
      metaTag.setAttribute('content', metaData.content);
      document.head.insertBefore(metaTag, document.head.firstChild);
    } 
    else if (metaTag.getAttribute('content') !== metaData.content) {
      metaTag.setAttribute('content', metaData.content);
    }
    
    if (metaTag !== document.head.firstElementChild) {
      document.head.removeChild(metaTag);
      document.head.insertBefore(metaTag, document.head.firstChild);
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

// Initialize React app first, then run utility functions
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

// Run utility functions after React is initialized
requestAnimationFrame(() => {
  ensureVerificationTags();
  handleSiteVersioning();
});

// Periodically check for unwanted elements (after initial render)
setTimeout(() => {
  removeUnwantedElements();
  setInterval(removeUnwantedElements, 2000);
}, 1000);
