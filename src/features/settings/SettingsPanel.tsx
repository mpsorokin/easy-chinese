import { SETTING_OPTIONS } from './settings.ts';
import type { Settings } from './settings.ts';
import Seg from '../../shared/ui/Seg.tsx';
import { t } from '../../shared/i18n/en.ts';
import WriteIcon from '../../shared/ui/WriteIcon.tsx';
import './SettingsPanel.css';

// [value, label] pairs; indexing t.options by the value type keeps labels complete.
const GRID = SETTING_OPTIONS.grid.map((v) => [v, t.options.grid[v]] as const);
const STRICT = SETTING_OPTIONS.strict.map(
  (v) => [v, t.options.strict[v]] as const,
);
const HINT = SETTING_OPTIONS.hint.map((v) => [v, t.options.hint[v]] as const);
const SPEED = SETTING_OPTIONS.speed.map(
  (v) => [v, t.options.speed[v]] as const,
);

export default function SettingsPanel({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (next: Settings) => void;
}) {
  return (
    <details className="settings">
      <summary>
        <WriteIcon name="settings" />
        {t.settings}
        <WriteIcon name="chevron" />
      </summary>
      <div className="row">
        <span>{t.settingGrid}</span>
        <Seg
          value={settings.grid}
          onChange={(grid) => onChange({ ...settings, grid })}
          options={GRID}
        />
      </div>
      <div className="row">
        <span>{t.settingStrict}</span>
        <Seg
          value={settings.strict}
          onChange={(strict) => onChange({ ...settings, strict })}
          options={STRICT}
        />
      </div>
      <div className="row">
        <span>{t.settingHint}</span>
        <Seg
          value={settings.hint}
          onChange={(hint) => onChange({ ...settings, hint })}
          options={HINT}
        />
      </div>
      <div className="row">
        <span>{t.settingSpeed}</span>
        <Seg
          value={settings.speed}
          onChange={(speed) => onChange({ ...settings, speed })}
          options={SPEED}
        />
      </div>
    </details>
  );
}
