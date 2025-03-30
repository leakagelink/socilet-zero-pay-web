
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the current match
    const updateMatch = () => {
      setMatches(media.matches);
    };
    
    // Call once to set the initial value
    updateMatch();
    
    // Set up the listener
    media.addEventListener('change', updateMatch);
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
