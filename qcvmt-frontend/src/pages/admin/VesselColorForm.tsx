import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, Input, InputNumber, Space, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselColorApi } from '@/api/vesselColor'
import type { VesselColorItem } from '@/types/bayConfig'
import { vesselColorFormSchema } from '@/utils/validators'

type VesselColorFormData = Omit<VesselColorItem, 'id'>

const VesselColorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(vesselColorFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<VesselColorFormData>({
    resolver,
    defaultValues: {
      vesselId: '',
      bayStart: 0,
      bayEnd: 0,
      rowStart: 0,
      rowEnd: 0,
      tierStart: 0,
      tierEnd: 0,
      color: '#1677ff',
    },
  })

  useEffect(() => {
    if (!isEdit || !id) {
      return
    }

    const loadDetail = async () => {
      setFetching(true)
      try {
        const response = await vesselColorApi.detail(Number(id))
        const item = response.data
        reset({
          vesselId: item.vesselId,
          bayStart: item.bayStart,
          bayEnd: item.bayEnd,
          rowStart: item.rowStart,
          rowEnd: item.rowEnd,
          tierStart: item.tierStart,
          tierEnd: item.tierEnd,
          color: item.color,
        })
      } catch (error) {
        messageApi.error((error as Error).message || 'Failed to load vessel color')
      } finally {
        setFetching(false)
      }
    }

    void loadDetail()
  }, [id, isEdit, messageApi, reset])

  const onSubmit = async (values: VesselColorFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        await vesselColorApi.update(Number(id), values)
        messageApi.success('Vessel color updated')
      } else {
        await vesselColorApi.create(values)
        messageApi.success('Vessel color created')
      }
      navigate('/admin/vessel-colors')
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
            {isEdit ? 'Edit Vessel Color' : 'Create Vessel Color'}
          </Typography.Title>
          <Button>
            <Link to="/admin/vessel-colors">Back to List</Link>
          </Button>
        </Space>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Vessel ID"
            validateStatus={errors.vesselId ? 'error' : ''}
            help={errors.vesselId?.message}
          >
            <Controller name="vesselId" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item label="Bay Start" validateStatus={errors.bayStart ? 'error' : ''} help={errors.bayStart?.message}>
              <Controller
                name="bayStart"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
            <Form.Item label="Bay End" validateStatus={errors.bayEnd ? 'error' : ''} help={errors.bayEnd?.message}>
              <Controller
                name="bayEnd"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
            <Form.Item label="Row Start" validateStatus={errors.rowStart ? 'error' : ''} help={errors.rowStart?.message}>
              <Controller
                name="rowStart"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
            <Form.Item label="Row End" validateStatus={errors.rowEnd ? 'error' : ''} help={errors.rowEnd?.message}>
              <Controller
                name="rowEnd"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Tier Start"
              validateStatus={errors.tierStart ? 'error' : ''}
              help={errors.tierStart?.message}
            >
              <Controller
                name="tierStart"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
            <Form.Item label="Tier End" validateStatus={errors.tierEnd ? 'error' : ''} help={errors.tierEnd?.message}>
              <Controller
                name="tierEnd"
                control={control}
                render={({ field }) => (
                  <InputNumber value={field.value} min={0} onChange={(value) => field.onChange(value ?? 0)} />
                )}
              />
            </Form.Item>
          </Space>

          <Form.Item label="Color" validateStatus={errors.color ? 'error' : ''} help={errors.color?.message}>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Space>
                  <input
                    aria-label="Pick vessel color"
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
            aria-label="Vessel color preview"
            style={{
              width: 120,
              height: 36,
              borderRadius: 8,
              border: '1px solid #ddd',
              background: selectedColor,
              marginBottom: 12,
            }}
          />

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Vessel Color'}
            </Button>
            <Button onClick={() => navigate('/admin/vessel-colors')}>Cancel</Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default VesselColorForm
