import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Space, Switch, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselRefuelApi } from '@/api/vesselRefuel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { VesselRefuelItem } from '@/types/bayConfig'
import { vesselRefuelFormSchema } from '@/utils/validators'

type VesselRefuelFormData = Omit<VesselRefuelItem, 'id'>

const toRefuelFlag = (value: boolean): string => (value ? 'Y' : 'N')
const isRefuelFlag = (value: string): boolean => value === 'Y'

const VesselRefuelForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
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
      isRefuel: 'N',
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
        notifyError(error, 'Failed to load refuel record')
      } finally {
        setFetching(false)
      }
    }

    void loadDetail()
  }, [id, isEdit, notifyError, reset])

  const onSubmit = async (values: VesselRefuelFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        await vesselRefuelApi.update(Number(id), values)
        notifySuccess('Refuel record updated')
      } else {
        await vesselRefuelApi.create(values)
        notifySuccess('Refuel record created')
      }
      navigate('/admin/vessel-refuels')
    } catch (error) {
      notifyError(error, 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  const isRefuel = watch('isRefuel')

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title={isEdit ? 'Edit Refuel Record' : 'Create Refuel Record'}
        subtitle="Set temporary refuel signals that affect terminal workflows."
        loading={fetching}
        extra={
          <Button>
            <Link to="/admin/vessel-refuels">Back to List</Link>
          </Button>
        }
      >

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
                  <Switch checked={isRefuelFlag(field.value)} onChange={(checked) => field.onChange(toRefuelFlag(checked))} />
                  <Typography.Text>{isRefuelFlag(isRefuel) ? 'Refuel' : 'Normal'}</Typography.Text>
                </Space>
              )}
            />
          </Form.Item>

          <PageFormActions
            submitText={isEdit ? 'Save Changes' : 'Create Refuel Record'}
            loading={loading}
            onCancel={() => navigate('/admin/vessel-refuels')}
          />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default VesselRefuelForm
