import { Input, Space } from 'antd'

interface ColorPickerFieldProps {
  value: string
  ariaLabel: string
  previewLabel: string
  onChange: (value: string) => void
}

export const ColorPickerField = ({ value, ariaLabel, previewLabel, onChange }: ColorPickerFieldProps) => {
  return (
    <>
      <Space>
        <input
          aria-label={ariaLabel}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{ width: 48, height: 32, border: 'none', background: 'transparent' }}
        />
        <Input value={value} onChange={(event) => onChange(event.target.value)} style={{ width: 140 }} />
      </Space>

      <div
        aria-label={previewLabel}
        style={{
          width: 120,
          height: 36,
          borderRadius: 8,
          border: '1px solid #ddd',
          background: value,
          marginTop: 8,
        }}
      />
    </>
  )
}
