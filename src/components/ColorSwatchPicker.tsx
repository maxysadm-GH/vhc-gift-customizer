import type { ColorOption } from '../data/customization';

interface Props {
  label: string;
  options: ColorOption[];
  selected: ColorOption;
  onChange: (color: ColorOption) => void;
}

export function ColorSwatchPicker({ label, options, selected, onChange }: Props) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 12,
        color: '#333',
      }}>
        {label}: <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>{selected.name}</span>
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map((color) => {
          const isSelected = color.name === selected.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange(color)}
              title={color.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: 0,
                border: isSelected ? '2px solid #38165f' : color.needsBorder ? '1px solid #ddd' : '1px solid transparent',
                background: color.hex,
                cursor: 'pointer',
                outline: isSelected ? '2px solid #38165f' : 'none',
                outlineOffset: 2,
                transition: 'all 0.15s',
                padding: 0,
              }}
              aria-label={color.name}
            />
          );
        })}
      </div>
    </div>
  );
}
