import type { MarqueeStyle, FontOption } from '../data/customization';

interface Props {
  selected: MarqueeStyle;
  onChange: (style: MarqueeStyle) => void;
  font: FontOption;
  boxColor: string;
  companyName: string;
}

export function MarqueeCardPicker({ selected, onChange, font, boxColor, companyName }: Props) {
  const preview = companyName || 'Your Company';
  const styles: { id: MarqueeStyle; label: string }[] = [
    { id: 'standard', label: 'Standard' },
    { id: 'marble', label: 'Marble' },
    { id: 'border', label: 'Border' },
  ];

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
        Marquee Card Style
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {styles.map(({ id, label }) => {
          const isSelected = id === selected;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              style={{
                padding: 0,
                border: isSelected ? '2px solid #38165f' : '1px solid #e5e5e5',
                borderRadius: 0,
                background: '#fff',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.15s',
              }}
            >
              {/* Card Preview */}
              <div style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                background: boxColor,
              }}>
                <div style={{
                  width: '80%',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  textAlign: 'center',
                  ...getMarqueeCardStyle(id),
                }}>
                  <span style={{
                    fontFamily: font.googleFont,
                    fontWeight: font.weight,
                    fontStyle: font.italic ? 'italic' : 'normal',
                    fontSize: 11,
                    color: '#333',
                    textTransform: font.name === 'DIDOT ALL CAPS' ? 'uppercase' : 'none',
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}>
                    {preview}
                  </span>
                </div>
              </div>
              {/* Label */}
              <div style={{
                padding: '8px 4px',
                fontSize: 12,
                color: '#333',
                fontWeight: isSelected ? 500 : 300,
                textAlign: 'center',
              }}>
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getMarqueeCardStyle(style: MarqueeStyle): React.CSSProperties {
  switch (style) {
    case 'standard':
      return {
        background: '#fff',
      };
    case 'marble':
      return {
        background: `
          linear-gradient(135deg, #f5f5f5 25%, transparent 25%),
          linear-gradient(225deg, #e8e8e8 25%, transparent 25%),
          linear-gradient(315deg, #f0f0f0 25%, transparent 25%),
          linear-gradient(45deg, #eee 25%, transparent 25%),
          radial-gradient(ellipse at 20% 80%, #e0ddd8 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, #d8d5d0 0%, transparent 50%),
          linear-gradient(180deg, #f2efe8, #e8e4dc)
        `,
      };
    case 'border':
      return {
        background: '#fff',
        boxShadow: 'inset 0 0 0 3px #c5a059',
      };
    default:
      return { background: '#fff' };
  }
}
