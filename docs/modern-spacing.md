# Modern vertical spacing

Under **Modern → Vertical spacing (Modern layout)** two native numeric fields
control the content's vertical insets independently:

- **Top padding (px)** / `modern_padding_top`: space above the current-weather row
  (icon, current temperature and clock). When a card title is configured this is
  the space between the header and content, not the native HA header's own inset.
- **Bottom padding (px)** / `modern_padding_bottom`: space below the last visible
  content row (including last-updated information if enabled).

Values from 0 to 80 pixels are supported. Zero removes the respective inset.
Clear a field to restore automatic spacing (compact: 16px, spacious: 20px,
card widths up to 300px: 12px). Explicit settings override those defaults,
including on narrow cards. Side padding and internal section spacing are unchanged.
Classic ignores these settings.

For a smaller top inset:

```yaml
layout: modern
modern_padding_top: 8
modern_padding_bottom: 12
```

Existing cards keep their previous spacing unless these options are set.
