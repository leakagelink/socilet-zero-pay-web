
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './hideLovable.css' // Import the CSS that hides Lovable elements

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
