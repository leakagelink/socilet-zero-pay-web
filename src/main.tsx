
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './hideLovable.css' // Import the CSS that hides Lovable elements

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

// Function to ensure verification meta tags are always present
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
  
  // Add any missing critical meta tags
  criticalMetaTags.forEach(metaData => {
    let metaTag = document.querySelector(`meta[name="${metaData.name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', metaData.name);
      metaTag.setAttribute('content', metaData.content);
      
      // Insert at the beginning of head to ensure it's before body
      if (document.head.firstChild) {
        document.head.insertBefore(metaTag, document.head.firstChild);
      } else {
        document.head.appendChild(metaTag);
      }
      console.log(`Added missing ${metaData.name} verification tag`);
    } else if (metaTag.getAttribute('content') !== metaData.content) {
      // Update content if it's wrong
      metaTag.setAttribute('content', metaData.content);
      console.log(`Updated ${metaData.name} verification tag content`);
    }
  });
};

// Run the cleanup and ensure verification tags initially
removeLovableElements();
ensureVerificationTags();

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
root.render(<App />);
