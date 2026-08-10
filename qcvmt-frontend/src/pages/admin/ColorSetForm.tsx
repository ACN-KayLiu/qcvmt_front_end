import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { colorSetApi } from '@/api/colorSet'
import type { CreateColorSetRequest, UpdateColorSetRequest } from '@/types/colorSet'
import { colorSetFormSchema } from '@/utils/validators'

type ColorSetFormData = {
  boxCase: string
  color: string
  description?: string
}

const ColorSetForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(colorSetFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ColorSetFormData>({
    resolver,
    defaultValues: {
      boxCase: '',
      color: '#1677ff',
      description: '',
    },
  })

  useEffect(() => {
    if (!isEdit || !id) {
      return
    }

    const loadColorSet = async () => {
      setFetching(true)
      try {
        const response = await colorSetApi.detail(Number(id))
        const colorSet = response.data
        reset({
          boxCase: colorSet.boxCase,
          color: colorSet.color,
          description: colorSet.description || '',
        })
      } catch (error) {
        messageApi.error((error as Error).message || 'Failed to load color set')
      } finally {
        setFetching(false)
      }
    }

    void loadColorSet()
  }, [id, isEdit, messageApi, reset])

  const onSubmit = async (values: ColorSetFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateColorSetRequest = values as UpdateColorSetRequest
        await colorSetApi.update(Number(id), payload)
        messageApi.success('Color set updated')
      } else {
        const payload: CreateColorSetRequest = values as CreateColorSetRequest
        await colorSetApi.create(payload)
        messageApi.success('Color set created')
      }
      navigate('/admin/color-sets')
    } catch (error) {
      messageApi.error((error as Error).message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  const selectedColor = watch('color')

  return (
    <Card loading={fetching}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {isEdit ? 'Edit Color Set' : 'Create Color Set'}
          </Typography.Title>
          <Button>
            <Link to="/admin/color-sets">Back to List</Link>
          </Button>
        </Space>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Box Case"
            validateStatus={errors.boxCase ? 'error' : ''}
            help={errors.boxCase?.message}
          >
            <Controller name="boxCase" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Color" validateStatus={errors.color ? 'error' : ''} help={errors.color?.message}>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Space>
                  <input
                    aria-label="Pick color"
                    type="color"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    style={{ width: 48, height: 32, border: 'none', background: 'transparent' }}
                  />
                  <Input value={field.value} onChange={field.onChange} style={{ width: 140 }} />
                </Space>
              )}
            />
          </Form.Item>

          <div
            aria-label="Color preview"
            style={{
              width: 120,
              height: 36,
              borderRadius: 8,
              border: '1px solid #ddd',
              background: selectedColor,
              marginBottom: 12,
            }}
          />

          <Form.Item
            label="Description"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input.TextArea {...field} rows={3} />}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Color Set'}
            </Button>
            <Button onClick={() => navigate('/admin/color-sets')}>Cancel</Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default ColorSetForm
