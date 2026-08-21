import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselColorApi } from '@/api/vesselColor'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { VesselColorItem } from '@/types/bayConfig'
import { vesselColorFormSchema } from '@/utils/validators'

type VesselColorFormData = Omit<VesselColorItem, 'id'>

const VesselColorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(vesselColorFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VesselColorFormData>({
    resolver,
    defaultValues: {
      vesselId: '',
      deckHold: '',
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

    const loadDetail = async () => {
      setFetching(true)
      try {
        const response = await vesselColorApi.detail(Number(id))
        const item = response.data
        reset({
          vesselId: item.vesselId,
          deckHold: item.deckHold,
          bay: item.bay,
          rowStart: item.rowStart,
          rowEnd: item.rowEnd,
          tierStart: item.tierStart,
          tierEnd: item.tierEnd,
        })
      } catch (error) {
        notifyError(error, 'Failed to load vessel color')
      } finally {
        setFetching(false)
      }
    }

    void loadDetail()
  }, [id, isEdit, notifyError, reset])

  const onSubmit = async (values: VesselColorFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        await vesselColorApi.update(Number(id), {
          rowStart: values.rowStart,
          rowEnd: values.rowEnd,
          tierStart: values.tierStart,
          tierEnd: values.tierEnd,
        })
        notifySuccess('Vessel color updated')
      } else {
        await vesselColorApi.create(values)
        notifySuccess('Vessel color created')
      }
      navigate('/admin/vessel-colors')
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
        title={isEdit ? 'Edit Vessel Color' : 'Create Vessel Color'}
        subtitle="Map vessel bay ranges to visual colors for planning clarity."
        loading={fetching}
        extra={
          <Button>
            <Link to="/admin/vessel-colors">Back to List</Link>
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

          <Form.Item label="Deck/Hold" validateStatus={errors.deckHold ? 'error' : ''} help={errors.deckHold?.message}>
            <Controller name="deckHold" control={control} render={({ field }) => <Input {...field} />} />
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
            submitText={isEdit ? 'Save Changes' : 'Create Vessel Color'}
            loading={loading}
            onCancel={() => navigate('/admin/vessel-colors')}
          />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default VesselColorForm
