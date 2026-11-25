import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import ThemeProvider from '@/features/settings/ThemeProvider.tsx';
import '@/styles/base.css';
import { migratePrefix } from '@/shared/lib/storage.ts';
import { reloadOnce } from '@/shared/lib/staleBuild.ts';
import { router } from '@/app/router.tsx';

// Storage prefix was renamed from `propis:` to `hanzi:`; carry over existing data.
migratePrefix('propis:', 'hanzi:');

// A chunk of an older build is gone after an update: reload into the new version. If it
// can't (it just did), the error reaches the router's error page instead.
// The reload opens the page that was being navigated to, so the tap isn't lost.
window.addEventListener('vite:preloadError', (event) => {
  const next = router.state.navigation.location;
  if (reloadOnce(next && router.createHref(next))) event.preventDefault();
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
