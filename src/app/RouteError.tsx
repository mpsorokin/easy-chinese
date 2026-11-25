import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { t } from '@/shared/i18n/en.ts';
import {
  isChunkLoadError,
  isReloading,
  reloadOnce,
} from '@/shared/lib/staleBuild.ts';

// Shown instead of a page that failed to load or render. A page of an older build that is
// gone after an update reloads into the new version by itself.
export default function RouteError() {
  const error = useRouteError();
  const stale = isChunkLoadError(error);

  useEffect(() => {
    if (stale) reloadOnce();
    else console.error(error);
  }, [stale, error]);

  if (stale && isReloading()) return null;

  return (
    <main className="page-frame page-header route-error" role="alert">
      <h1>{t.errorTitle}</h1>
      <p>{t.errorText}</p>
      <div className="route-error-actions">
        <button
          className="btn primary"
          onClick={() => window.location.reload()}
        >
          {t.reload}
        </button>
        <a className="btn" href={import.meta.env.BASE_URL}>
          {t.homeLabel}
        </a>
      </div>
    </main>
  );
}
