import { Form, InputNumber, Space } from 'antd'
import { Controller, type Control, type FieldErrors, type Path } from 'react-hook-form'

interface RangeFieldValues {
  bayStart: number
  bayEnd: number
  rowStart: number
  rowEnd: number
  tierStart: number
  tierEnd: number
}

interface RangeNumberFieldsProps<T extends RangeFieldValues> {
  control: Control<T>
  errors: FieldErrors<T>
}

interface FieldDef {
  label: string
  name: keyof RangeFieldValues
}

const fieldDefs: FieldDef[] = [
  { label: 'Bay Start', name: 'bayStart' },
  { label: 'Bay End', name: 'bayEnd' },
  { label: 'Row Start', name: 'rowStart' },
  { label: 'Row End', name: 'rowEnd' },
  { label: 'Tier Start', name: 'tierStart' },
  { label: 'Tier End', name: 'tierEnd' },
]

export const RangeNumberFields = <T extends RangeFieldValues>({
  control,
  errors,
}: RangeNumberFieldsProps<T>) => {
  return (
    <Space style={{ width: '100%' }} size="middle" wrap>
      {fieldDefs.map((fieldDef) => {
        const name = fieldDef.name as Path<T>
        const fieldError = errors[fieldDef.name]

        return (
          <Form.Item
            key={fieldDef.name}
            label={fieldDef.label}
            validateStatus={fieldError ? 'error' : ''}
            help={fieldError?.message as string | undefined}
          >
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
              )}
            />
          </Form.Item>
        )
      })}
    </Space>
  )
}
