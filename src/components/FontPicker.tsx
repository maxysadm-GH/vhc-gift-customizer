import type { FontOption } from '../data/customization';

interface Props {
  options: FontOption[];
  selected: FontOption;
  onChange: (font: FontOption) => void;
  companyName: string;
}

const categoryColors: Record<string, string> = {
  'Serif': '#38165f',
  'Sans Serif': '#2c5aa0',
  'Script': '#c5a059',
};

export function FontPicker({ options, selected, onChange, companyName }: Props) {
  const preview = companyName || 'Your Company Name';

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
        Font
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map((font) => {
          const isSelected = font.name === selected.name;
          return (
            <button
              key={font.name}
              type="button"
              onClick={() => onChange(font)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: isSelected ? '2px solid #38165f' : '1px solid #e5e5e5',
                borderRadius: 0,
                background: isSelected ? '#f8f5ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12,
                  color: '#666',
                  marginBottom: 4,
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {font.name}
                  <span style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    background: categoryColors[font.category] || '#999',
                    color: '#fff',
                    borderRadius: 0,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}>
                    {font.category}
                  </span>
                </div>
                <div style={{
                  fontFamily: font.googleFont,
                  fontWeight: font.weight,
                  fontStyle: font.italic ? 'italic' : 'normal',
                  fontSize: font.name === 'DIDOT ALL CAPS' ? 16 : 18,
                  color: '#333',
                  textTransform: font.name === 'DIDOT ALL CAPS' ? 'uppercase' : 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {preview}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
