import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, InputNumber } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { bayConfigApi } from '@/api/bayConfig'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { BayConfig } from '@/types/bayConfig'
import { bayConfigFormSchema } from '@/utils/validators'

const BaySizeForm = () => {
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const resolver = useMemo(() => zodResolver(bayConfigFormSchema), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BayConfig>({
    resolver,
    defaultValues: {
      id: 0,
      type: 'HOLD',
      row: '0',
      tier: '0',
      tierStart: '0',
      tierEnd: '0',
      active: '1',
    },
  })

  useEffect(() => {
    const loadConfig = async () => {
      setFetching(true)
      try {
        const response = await bayConfigApi.get()
        reset(response.data)
      } catch (error) {
        notifyError(error, 'Failed to load bay config')
      } finally {
        setFetching(false)
      }
    }

    void loadConfig()
  }, [notifyError, reset])

  const onSubmit = async (values: BayConfig) => {
    setLoading(true)
    try {
      await bayConfigApi.update(values)
      notifySuccess('Bay config saved')
    } catch (error) {
      notifyError(error, 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Bay Size Configuration"
        subtitle="Configure hold/deck tier boundaries consumed by the bay matrix generator."
        loading={fetching}
      >

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Tier Start"
            validateStatus={errors.tierStart ? 'error' : ''}
            help={errors.tierStart?.message}
          >
            <Controller
              name="tierStart"
              control={control}
              render={({ field }) => (
                <InputNumber
                  value={Number(field.value || 0)}
                  min={0}
                  onChange={(value) => field.onChange(String(value ?? 0))}
                  aria-label="Tier start"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Tier End"
            validateStatus={errors.tierEnd ? 'error' : ''}
            help={errors.tierEnd?.message}
          >
            <Controller
              name="tierEnd"
              control={control}
              render={({ field }) => (
                <InputNumber
                  value={Number(field.value || 0)}
                  min={0}
                  onChange={(value) => field.onChange(String(value ?? 0))}
                  aria-label="Tier end"
                />
              )}
            />
          </Form.Item>

          <PageFormActions submitText="Save" loading={loading} />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default BaySizeForm
