import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { vesselColorApi } from '@/api/vesselColor'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { ColorPickerField } from '@/components/common/ColorPickerField'
import { PageFormActions } from '@/components/common/PageFormActions'
import { RangeNumberFields } from '@/components/common/RangeNumberFields'
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
        await vesselColorApi.update(Number(id), values)
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

          <RangeNumberFields control={control} errors={errors} />

          <Form.Item label="Color" validateStatus={errors.color ? 'error' : ''} help={errors.color?.message}>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorPickerField
                  value={field.value}
                  onChange={field.onChange}
                  ariaLabel="Pick vessel color"
                  previewLabel="Vessel color preview"
                />
              )}
            />
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
