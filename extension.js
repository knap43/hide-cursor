import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class HideCursorExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._tracker = global.backend.get_cursor_tracker();
        this._hidden = false;
        this._timeoutId = 0;
        this._lastMove = GLib.get_monotonic_time();

        this._motionId = this._tracker.connect('position-invalidated',
            () => this._onMotion());
        this._settingsId = this._settings.connect('changed::timeout',
            () => this._onMotion());

        this._schedule(this._delayMs());
    }

    disable() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = 0;
        }
        this._tracker.disconnect(this._motionId);
        this._settings.disconnect(this._settingsId);
        this._show();
        this._tracker = null;
        this._settings = null;
    }

    _delayMs() {
        return Math.round(this._settings.get_double('timeout') * 1000);
    }

    _onMotion() {
        this._lastMove = GLib.get_monotonic_time();
        this._show();
        // A single pending timer suffices; it re-arms itself for any remainder.
        if (!this._timeoutId)
            this._schedule(this._delayMs());
    }

    _schedule(ms) {
        this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, ms, () => {
            this._timeoutId = 0;
            const elapsed = (GLib.get_monotonic_time() - this._lastMove) / 1000;
            const remaining = this._delayMs() - elapsed;
            if (remaining > 0)
                this._schedule(Math.ceil(remaining));
            else
                this._hide();
            return GLib.SOURCE_REMOVE;
        });
    }

    _hide() {
        if (this._hidden)
            return;
        this._tracker.inhibit_cursor_visibility();
        this._hidden = true;
    }

    _show() {
        if (!this._hidden)
            return;
        this._tracker.uninhibit_cursor_visibility();
        this._hidden = false;
    }
}
