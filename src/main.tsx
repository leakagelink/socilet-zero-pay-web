
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Direct render without any wrappers to avoid any "Edit with Lovable" badges
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
