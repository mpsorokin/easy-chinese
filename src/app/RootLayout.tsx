import { Outlet, ScrollRestoration } from 'react-router';

// Root layout: the current page plus scroll restoration (top on new pages, the saved
// position on back/forward).
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
