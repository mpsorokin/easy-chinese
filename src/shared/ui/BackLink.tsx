import type { ReactNode } from 'react';
import { Link } from 'react-router';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';

// The link at the top of a page back to where it was opened from. Pages tune its look
// with a class of their own (see .back-link in base.css).
export default function BackLink({
  to,
  children,
  icon = 'back',
  className,
}: {
  to: string;
  children: ReactNode;
  icon?: 'back' | 'chevron';
  className?: string;
}) {
  return (
    <Link
      className={className ? `back-link ${className}` : 'back-link'}
      to={to}
    >
      <WriteIcon name={icon} />
      {children}
    </Link>
  );
}
