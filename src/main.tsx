
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './hideLovable.css'; // Import the CSS that hides Lovable elements
import { AuthProvider } from "@/hooks/useAuth";

// Remove any existing Lovable elements
const removeLovableElements = () => {
  // Find and remove any scripts related to Lovable or GPT Engineer
  document.querySelectorAll('script').forEach(script => {
    if (script.src.includes('lovable') || 
        script.src.includes('gpteng') || 
        script.innerHTML.includes('lovable') || 
        script.innerHTML.includes('gpteng')) {
      script.remove();
    }
  });

  // Find and remove any dynamic elements related to Lovable or GPT Engineer
  document.querySelectorAll('div').forEach(div => {
    if ((div.id && (div.id.includes('lovable') || div.id.includes('gpteng'))) || 
        (div.className && (div.className.includes('lovable') || div.className.includes('gpteng'))) ||
        (div.hasAttribute('data-lovable-id'))) {
      div.remove();
    }
  });

  // Remove any fixed position elements that might be the popup
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
    console.error('Document head not found');
    return;
  }
  
  // Add any missing critical meta tags
  criticalMetaTags.forEach(metaData => {
    let metaTag = document.querySelector(`meta[name="${metaData.name}"]`);
    
    // If the meta tag doesn't exist, create it and add it to the head
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', metaData.name);
      metaTag.setAttribute('content', metaData.content);
      
      // Insert as the first element in head to ensure it's before body
      document.head.insertBefore(metaTag, document.head.firstChild);
      console.log(`Added missing ${metaData.name} verification tag`);
    } 
    // If the meta tag exists but has the wrong content, update it
    else if (metaTag.getAttribute('content') !== metaData.content) {
      metaTag.setAttribute('content', metaData.content);
      console.log(`Updated ${metaData.name} verification tag content`);
    }
    
    // Move the tag to the beginning of head if it's not already there
    if (metaTag !== document.head.firstElementChild) {
      document.head.removeChild(metaTag);
      document.head.insertBefore(metaTag, document.head.firstChild);
      console.log(`Moved ${metaData.name} verification tag to top of head`);
    }
  });
};

// Function to handle site versioning
const handleSiteVersioning = () => {
  // Initialize site version if not already set
  if (!localStorage.getItem('site-version')) {
    localStorage.setItem('site-version', new Date().getTime().toString());
  }
  
  // Check if we're loading with cache refresh parameter
  const urlParams = new URLSearchParams(window.location.search);
  const cacheRefresh = urlParams.get('refresh-cache');
  
  if (cacheRefresh === 'true') {
    console.log('Cache refresh requested via URL parameter');
    // Clear browser caches if supported
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear localStorage cache except critical items
    Object.keys(localStorage).forEach(key => {
      if (key !== 'site-version' && !key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // Set current version to match site version
    const siteVersion = localStorage.getItem('site-version');
    if (siteVersion) {
      localStorage.setItem('current-site-version', siteVersion);
    }
    
    // Set a flag to force reload assets
    window.sessionStorage.setItem('force-reload-assets', 'true');
    
    // Remove the parameter from URL
    urlParams.delete('refresh-cache');
    const newUrl = window.location.pathname + 
                   (urlParams.toString() ? '?' + urlParams.toString() : '') + 
                   window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
  
  // Set a unique cache-busting query parameter for all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && !input.includes('data:') && !input.includes('blob:')) {
      const url = new URL(input, window.location.href);
      // Only add cache busting for our own resources, not external APIs
      if (url.origin === window.location.origin) {
        url.searchParams.set('v', localStorage.getItem('site-version') || '1');
        input = url.toString();
      }
    }
    return originalFetch(input, init);
  };
};

// Run the initialization functions
removeLovableElements();
ensureVerificationTags();
handleSiteVersioning();

// Also run it after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  removeLovableElements();
  ensureVerificationTags();
});

// And periodically check for and remove new elements
setInterval(() => {
  removeLovableElements();
  ensureVerificationTags();
}, 1000);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
