import type { ComponentProps, ReactNode } from 'react';
import BackLink from '../../shared/ui/BackLink.tsx';
import ThemeControl from './ThemeControl.tsx';

// The row at the top of most pages: a back link, optional extra links and the theme control.
export default function PageToolbar({
  back,
  children,
}: {
  back: ComponentProps<typeof BackLink>;
  children?: ReactNode;
}) {
  return (
    <div className="theme-toolbar">
      <BackLink {...back} />
      {children}
      <ThemeControl />
    </div>
  );
}
