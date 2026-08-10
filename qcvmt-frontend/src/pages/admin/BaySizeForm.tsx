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
      holdTiers: 0,
      deckTiers: 0,
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
            label="Hold Tiers"
            validateStatus={errors.holdTiers ? 'error' : ''}
            help={errors.holdTiers?.message}
          >
            <Controller
              name="holdTiers"
              control={control}
              render={({ field }) => (
                <InputNumber
                  value={field.value}
                  min={0}
                  onChange={(value) => field.onChange(value ?? 0)}
                  aria-label="Hold tiers"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Deck Tiers"
            validateStatus={errors.deckTiers ? 'error' : ''}
            help={errors.deckTiers?.message}
          >
            <Controller
              name="deckTiers"
              control={control}
              render={({ field }) => (
                <InputNumber
                  value={field.value}
                  min={0}
                  onChange={(value) => field.onChange(value ?? 0)}
                  aria-label="Deck tiers"
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
