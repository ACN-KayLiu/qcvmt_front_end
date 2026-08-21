import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselApi } from '@/api/vessel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { CreateVesselRequest, UpdateVesselRequest, Vessel } from '@/types/vessel'
import { vesselFormSchema } from '@/utils/validators'

type VesselFormData = {
  vesselId: string
  deckHold: Vessel['deckHold']
  bay: string
  rowStart: string
  rowEnd: string
  tierStart: string
  tierEnd: string
}

const deckHoldOptions = [
  { label: 'DECK', value: 'DECK' },
  { label: 'HOLD', value: 'HOLD' },
] as const

const VesselForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
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
      deckHold: 'DECK',
      bay: '',
      rowStart: '',
      rowEnd: '',
      tierStart: '',
      tierEnd: '',
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
        notifyError(error, 'Failed to load vessel')
      } finally {
        setFetching(false)
      }
    }

    void loadVessel()
  }, [id, isEdit, notifyError, reset])

  const onSubmit = async (values: VesselFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateVesselRequest = values
        const payload: UpdateVesselRequest = {
          rowStart: values.rowStart,
          rowEnd: values.rowEnd,
          tierStart: values.tierStart,
          tierEnd: values.tierEnd,
        }
        await vesselApi.update(Number(id), payload)
        notifySuccess('Vessel updated')
      } else {
        const payload: CreateVesselRequest = values
        await vesselApi.create(payload)
        notifySuccess('Vessel created')
      }
      navigate('/admin/vessels')
    } catch (error) {
      notifyError(error, 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title={isEdit ? 'Edit Vessel' : 'Create Vessel'}
        subtitle="Configure vessel identity and operation ranges for planning pipelines."
        loading={fetching}
        extra={
          <Button>
            <Link to="/admin/vessels">Back to List</Link>
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

          <Form.Item label="Bay" validateStatus={errors.bay ? 'error' : ''} help={errors.bay?.message}>
            <Controller name="bay" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item
            label="Row Start"
            validateStatus={errors.rowStart ? 'error' : ''}
            help={errors.rowStart?.message}
          >
            <Controller name="rowStart" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Row End" validateStatus={errors.rowEnd ? 'error' : ''} help={errors.rowEnd?.message}>
            <Controller name="rowEnd" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item
            label="Tier Start"
            validateStatus={errors.tierStart ? 'error' : ''}
            help={errors.tierStart?.message}
          >
            <Controller name="tierStart" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Tier End" validateStatus={errors.tierEnd ? 'error' : ''} help={errors.tierEnd?.message}>
            <Controller name="tierEnd" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <PageFormActions
            submitText={isEdit ? 'Save Changes' : 'Create Vessel'}
            loading={loading}
            onCancel={() => navigate('/admin/vessels')}
          />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default VesselForm
