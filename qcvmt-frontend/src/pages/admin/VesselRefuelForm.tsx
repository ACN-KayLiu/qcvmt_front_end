import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, Input, Space, Switch, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselRefuelApi } from '@/api/vesselRefuel'
import type { VesselRefuelItem } from '@/types/bayConfig'
import { vesselRefuelFormSchema } from '@/utils/validators'

type VesselRefuelFormData = Omit<VesselRefuelItem, 'id'>

const VesselRefuelForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(vesselRefuelFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<VesselRefuelFormData>({
    resolver,
    defaultValues: {
      vesselId: '',
      isRefuel: false,
    },
  })

  useEffect(() => {
    if (!isEdit || !id) {
      return
    }

    const loadDetail = async () => {
      setFetching(true)
      try {
        const response = await vesselRefuelApi.detail(Number(id))
        const item = response.data
        reset({ vesselId: item.vesselId, isRefuel: item.isRefuel })
      } catch (error) {
        messageApi.error((error as Error).message || 'Failed to load refuel record')
      } finally {
        setFetching(false)
      }
    }

    void loadDetail()
  }, [id, isEdit, messageApi, reset])

  const onSubmit = async (values: VesselRefuelFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        await vesselRefuelApi.update(Number(id), values)
        messageApi.success('Refuel record updated')
      } else {
        await vesselRefuelApi.create(values)
        messageApi.success('Refuel record created')
      }
      navigate('/admin/vessel-refuels')
    } catch (error) {
      messageApi.error((error as Error).message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  const isRefuel = watch('isRefuel')

  return (
    <Card loading={fetching}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {isEdit ? 'Edit Refuel Record' : 'Create Refuel Record'}
          </Typography.Title>
          <Button>
            <Link to="/admin/vessel-refuels">Back to List</Link>
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

          <Form.Item label="Refuel Status" validateStatus={errors.isRefuel ? 'error' : ''} help={errors.isRefuel?.message}>
            <Controller
              name="isRefuel"
              control={control}
              render={({ field }) => (
                <Space>
                  <Switch checked={field.value} onChange={field.onChange} />
                  <Typography.Text>{isRefuel ? 'Refuel' : 'Normal'}</Typography.Text>
                </Space>
              )}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Refuel Record'}
            </Button>
            <Button onClick={() => navigate('/admin/vessel-refuels')}>Cancel</Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default VesselRefuelForm
