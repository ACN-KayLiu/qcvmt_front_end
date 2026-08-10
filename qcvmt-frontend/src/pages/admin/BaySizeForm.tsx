import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, InputNumber, Space, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { bayConfigApi } from '@/api/bayConfig'
import type { BayConfig } from '@/types/bayConfig'
import { bayConfigFormSchema } from '@/utils/validators'

const BaySizeForm = () => {
  const [messageApi, contextHolder] = message.useMessage()
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
        messageApi.error((error as Error).message || 'Failed to load bay config')
      } finally {
        setFetching(false)
      }
    }

    void loadConfig()
  }, [messageApi, reset])

  const onSubmit = async (values: BayConfig) => {
    setLoading(true)
    try {
      await bayConfigApi.update(values)
      messageApi.success('Bay config saved')
    } catch (error) {
      messageApi.error((error as Error).message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card loading={fetching}>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Typography.Title level={5} style={{ margin: 0 }}>
          Bay Size Configuration
        </Typography.Title>

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

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default BaySizeForm
