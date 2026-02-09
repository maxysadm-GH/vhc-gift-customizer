import type { HangTagStyle, FontOption } from '../data/customization';

interface Props {
  selected: HangTagStyle;
  onChange: (style: HangTagStyle) => void;
  font: FontOption;
  boxColor: string;
  companyName: string;
}

export function HangTagPicker({ selected, onChange, font, boxColor, companyName }: Props) {
  const initial = (companyName || 'Co')[0].toUpperCase();
  const styles: { id: HangTagStyle; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'octagon', label: 'Octagon' },
    { id: 'rectangle', label: 'Rectangle' },
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
        Hang Tag Style
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
                padding: 16,
                border: isSelected ? '2px solid #38165f' : '1px solid #e5e5e5',
                borderRadius: 0,
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}
            >
              {/* Tag shape */}
              <div style={{
                position: 'relative',
                ...getTagShapeStyle(id, boxColor),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Hole punch */}
                <div style={{
                  position: 'absolute',
                  top: id === 'octagon' ? 6 : 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#fff',
                  border: `1px solid ${boxColor}`,
                }} />
                {/* Text */}
                <span style={{
                  fontFamily: font.googleFont,
                  fontWeight: font.weight,
                  fontStyle: font.italic ? 'italic' : 'normal',
                  fontSize: 12,
                  color: isLightColor(boxColor) ? '#333' : '#fff',
                  marginTop: 4,
                }}>
                  {initial}
                </span>
              </div>
              {/* Label */}
              <span style={{
                fontSize: 12,
                color: '#333',
                fontWeight: isSelected ? 500 : 300,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getTagShapeStyle(style: HangTagStyle, color: string): React.CSSProperties {
  switch (style) {
    case 'square':
      return {
        width: 50,
        height: 50,
        background: color,
      };
    case 'octagon':
      return {
        width: 55,
        height: 55,
        background: color,
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      };
    case 'rectangle':
      return {
        width: 40,
        height: 60,
        background: color,
      };
    default:
      return { width: 50, height: 50, background: color };
  }
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}
