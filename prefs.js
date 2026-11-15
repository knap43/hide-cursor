import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class HideCursorPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({title: 'Behaviour'});

        const row = Adw.SpinRow.new_with_range(0.5, 600, 0.5);
        row.title = 'Hide after';
        row.subtitle = 'Seconds without mouse movement';
        row.digits = 1;
        settings.bind('timeout', row, 'value', Gio.SettingsBindFlags.DEFAULT);

        group.add(row);
        page.add(group);
        window.add(page);
    }
}
