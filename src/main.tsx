
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
  
  // Make sure we don't accidentally remove meta tags
  document.querySelectorAll('meta').forEach(meta => {
    // Preserve all meta tags, especially verification tags
    if (meta.getAttribute('name') === 'msvalidate.01' || 
        meta.getAttribute('name') === 'google-site-verification') {
      // Ensure these critical meta tags are always present in the head
      if (!document.head.contains(meta)) {
        document.head.appendChild(meta.cloneNode(true));
      }
    }
  });
};

// Function to ensure verification meta tags are always present
const ensureVerificationTags = () => {
  // Bing verification
  let bingTag = document.querySelector('meta[name="msvalidate.01"]');
  if (!bingTag) {
    bingTag = document.createElement('meta');
    bingTag.setAttribute('name', 'msvalidate.01');
    bingTag.setAttribute('content', 'F369CBC92F03EBB72A41A8782CB42881');
    document.head.appendChild(bingTag);
  }
  
  // Google verification
  let googleTag = document.querySelector('meta[name="google-site-verification"]');
  if (!googleTag) {
    googleTag = document.createElement('meta');
    googleTag.setAttribute('name', 'google-site-verification');
    googleTag.setAttribute('content', '9-T-e6qKoCEslMvWnfKDeXadkedKtT_DtKhdPKPKyjY');
    document.head.appendChild(googleTag);
  }
};

// Run the cleanup initially
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
