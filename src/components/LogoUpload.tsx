import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface Props {
  logoPreviewUrl: string | null;
  onUpload: (file: File, previewUrl: string) => void;
  onClear: () => void;
}

export function LogoUpload({ logoPreviewUrl, onUpload, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const validExt = ['.png', '.jpg', '.jpeg', '.svg', '.ai', '.eps'];
    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext || !validExt.includes(ext)) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onUpload(file, e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      onUpload(file, '');
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  if (logoPreviewUrl !== null) {
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
          Company Logo
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 16,
          border: '1px solid #e5e5e5',
          background: '#fafafa',
        }}>
          {logoPreviewUrl ? (
            <img src={logoPreviewUrl} alt="Logo" style={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              background: '#fff',
              padding: 4,
              border: '1px solid #eee',
            }} />
          ) : (
            <div style={{
              width: 64,
              height: 64,
              background: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              📄
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#38165f',
              textDecoration: 'underline',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

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
        Company Logo
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: dragOver ? '2px solid #38165f' : '2px dashed #ccc',
          padding: 32,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#f8f5ff' : '#fafafa',
          transition: 'all 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.ai,.eps"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: 28, marginBottom: 8, color: '#999' }}>
          &#8682;
        </div>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
          Drop your logo here or click to browse
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>
          PNG, JPG, SVG, AI, EPS
        </div>
      </div>
    </div>
  );
}
