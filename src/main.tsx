
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a clean root without any additional wrappers
createRoot(document.getElementById("root")!).render(<App />);
