import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BugCatcherApp from './BugCatcherApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BugCatcherApp />
  </StrictMode>
);