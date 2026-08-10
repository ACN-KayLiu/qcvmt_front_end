import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselApi } from '@/api/vessel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { RangeNumberFields } from '@/components/common/RangeNumberFields'
import { usePageMessage } from '@/hooks/usePageMessage'
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

          <RangeNumberFields control={control} errors={errors} />

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
