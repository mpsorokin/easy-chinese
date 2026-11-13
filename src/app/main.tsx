import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import '../styles/base.css';
import { migratePrefix } from '../shared/lib/storage.ts';
import { router } from './router.tsx';

// Storage prefix was renamed from `propis:` to `hanzi:`; carry over existing data.
migratePrefix('propis:', 'hanzi:');

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
