import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselApi } from '@/api/vessel'
import type { CreateVesselRequest, UpdateVesselRequest, Vessel } from '@/types/vessel'
import { vesselFormSchema } from '@/utils/validators'

type VesselFormData = {
  vesselId: string
  vesselName: string
  deckHold: Vessel['deckHold']
  bayStart: number
  bayEnd: number
  rowStart: number
  rowEnd: number
  tierStart: number
  tierEnd: number
}

const deckHoldOptions = [
  { label: 'DECK', value: 'DECK' },
  { label: 'HOLD', value: 'HOLD' },
] as const

const VesselForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(vesselFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VesselFormData>({
    resolver,
    defaultValues: {
      vesselId: '',
      vesselName: '',
      deckHold: 'DECK',
      bayStart: 0,
      bayEnd: 0,
      rowStart: 0,
      rowEnd: 0,
      tierStart: 0,
      tierEnd: 0,
    },
  })

  useEffect(() => {
    if (!isEdit || !id) {
      return
    }

    const loadVessel = async () => {
      setFetching(true)
      try {
        const response = await vesselApi.detail(Number(id))
        reset(response.data)
      } catch (error) {
        messageApi.error((error as Error).message || 'Failed to load vessel')
      } finally {
        setFetching(false)
      }
    }

    void loadVessel()
  }, [id, isEdit, messageApi, reset])

  const onSubmit = async (values: VesselFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateVesselRequest = values
        await vesselApi.update(Number(id), payload)
        messageApi.success('Vessel updated')
      } else {
        const payload: CreateVesselRequest = values
        await vesselApi.create(payload)
        messageApi.success('Vessel created')
      }
      navigate('/admin/vessels')
    } catch (error) {
      messageApi.error((error as Error).message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card loading={fetching}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {isEdit ? 'Edit Vessel' : 'Create Vessel'}
          </Typography.Title>
          <Button>
            <Link to="/admin/vessels">Back to List</Link>
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

          <Form.Item
            label="Vessel Name"
            validateStatus={errors.vesselName ? 'error' : ''}
            help={errors.vesselName?.message}
          >
            <Controller
              name="vesselName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Deck/Hold"
            validateStatus={errors.deckHold ? 'error' : ''}
            help={errors.deckHold?.message}
          >
            <Controller
              name="deckHold"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={deckHoldOptions.map((option) => ({ ...option }))}
                />
              )}
            />
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

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Vessel'}
            </Button>
            <Button onClick={() => navigate('/admin/vessels')}>Cancel</Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default VesselForm
