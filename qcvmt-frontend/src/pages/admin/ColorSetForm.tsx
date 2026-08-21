import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Space } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { colorSetApi } from '@/api/colorSet'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { ColorPickerField } from '@/components/common/ColorPickerField'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { CreateColorSetRequest, UpdateColorSetRequest } from '@/types/colorSet'
import { colorSetFormSchema } from '@/utils/validators'

type ColorSetFormData = {
  boxcase: string
  color: string
}

const ColorSetForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(() => zodResolver(colorSetFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColorSetFormData>({
    resolver,
    defaultValues: {
      boxcase: '',
      color: '#1677ff',
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
          boxcase: colorSet.boxcase,
          color: colorSet.color,
        })
      } catch (error) {
        notifyError(error, 'Failed to load color set')
      } finally {
        setFetching(false)
      }
    }

    void loadColorSet()
  }, [id, isEdit, notifyError, reset])

  const onSubmit = async (values: ColorSetFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateColorSetRequest = { color: values.color }
        await colorSetApi.update(Number(id), payload)
        notifySuccess('Color set updated')
      } else {
        const payload: CreateColorSetRequest = {
          boxcase: values.boxcase,
          color: values.color,
        }
        await colorSetApi.create(payload)
        notifySuccess('Color set created')
      }
      navigate('/admin/color-sets')
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
        title={isEdit ? 'Edit Color Set' : 'Create Color Set'}
        subtitle="Tune business color presets used by vessel and bay visualization layers."
        loading={fetching}
        extra={
          <Button>
            <Link to="/admin/color-sets">Back to List</Link>
          </Button>
        }
      >

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Box Case"
            validateStatus={errors.boxcase ? 'error' : ''}
            help={errors.boxcase?.message}
          >
            <Controller name="boxcase" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Color" validateStatus={errors.color ? 'error' : ''} help={errors.color?.message}>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorPickerField
                  value={field.value}
                  onChange={field.onChange}
                  ariaLabel="Pick color"
                  previewLabel="Color preview"
                />
              )}
            />
          </Form.Item>

          <PageFormActions
            submitText={isEdit ? 'Save Changes' : 'Create Color Set'}
            loading={loading}
            onCancel={() => navigate('/admin/color-sets')}
          />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default ColorSetForm
