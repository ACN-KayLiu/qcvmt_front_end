import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs, { type Dayjs } from 'dayjs'
import { Button, DatePicker, Form } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { importExportApi } from '@/api/importExport'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { usePageMessage } from '@/hooks/usePageMessage'
import { exportLogsSchema } from '@/utils/validators'

type ExportFormData = {
  from: string
  to: string
}

const ExportPage = () => {
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const [loading, setLoading] = useState(false)
  const resolver = useMemo(() => zodResolver(exportLogsSchema), [])

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ExportFormData>({
    resolver,
    defaultValues: {
      from: dayjs().startOf('day').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
  })

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const from = dates?.[0]?.format('YYYY-MM-DD') || ''
    const to = dates?.[1]?.format('YYYY-MM-DD') || ''
    setValue('from', from)
    setValue('to', to)
    void trigger(['from', 'to'])
  }

  const onSubmit = async (values: ExportFormData) => {
    setLoading(true)
    try {
      const result = await importExportApi.exportLogs(values.from, values.to)
      const url = window.URL.createObjectURL(result.blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download =
        result.filename || `operation-logs-${values.from}-to-${values.to}.xlsx`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
      notifySuccess('Export started')
    } catch (error) {
      notifyError(error, 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Export Operation Logs"
        subtitle="Download operation logs by date range for audits and incident analysis."
      >

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Date Range"
            validateStatus={errors.from || errors.to ? 'error' : ''}
            help={errors.from?.message || errors.to?.message}
          >
            <Controller
              name="from"
              control={control}
              render={({ field: fromField }) => (
                <Controller
                  name="to"
                  control={control}
                  render={({ field: toField }) => (
                    <DatePicker.RangePicker
                      value={[dayjs(fromField.value), dayjs(toField.value)]}
                      onChange={(values) => {
                        handleDateRangeChange(values as [Dayjs | null, Dayjs | null] | null)
                      }}
                      format="YYYY-MM-DD"
                      aria-label="Export log date range"
                    />
                  )}
                />
              )}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Export Logs
          </Button>
        </Form>
      </AdminPageCard>
    </>
  )
}

export default ExportPage
