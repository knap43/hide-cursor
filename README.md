# Hide Cursor

A GNOME Shell extension (GNOME 49–51) that hides the mouse cursor after a period
without pointer movement and reveals it again the moment the mouse moves.
Typing does not count as activity, so the cursor still hides while you write.

## Install

```sh
git clone https://github.com/knap43/hide-cursor.git
cd hide-cursor
glib-compile-schemas schemas/
ln -s "$PWD" ~/.local/share/gnome-shell/extensions/hide-cursor@knap.local
```

Log out and back in (Wayland), then:

```sh
gnome-extensions enable hide-cursor@knap.local
```

## Settings

```sh
gnome-extensions prefs hide-cursor@knap.local
```

The delay before hiding defaults to 3 seconds and accepts 0.5–600.
