import { useState } from 'react'
import { Button, Card, Space, Typography, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { importExportApi } from '@/api/importExport'

const MAX_FILE_SIZE_MB = 10
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv']

const ImportPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const uploadProps: UploadProps = {
    multiple: false,
    maxCount: 1,
    accept: ACCEPTED_EXTENSIONS.join(','),
    fileList,
    beforeUpload: (file) => {
      const fileName = file.name.toLowerCase()
      const isSupported = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))
      if (!isSupported) {
        messageApi.error(`Unsupported file type. Allowed: ${ACCEPTED_EXTENSIONS.join(', ')}`)
        return Upload.LIST_IGNORE
      }

      const isWithinSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      if (!isWithinSize) {
        messageApi.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        return Upload.LIST_IGNORE
      }

      return false
    },
    onChange: ({ fileList: nextFileList }) => setFileList(nextFileList),
  }

  const handleUpload = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      messageApi.warning('Please select a file to upload')
      return
    }

    setLoading(true)
    try {
      const response = await importExportApi.importVessel(fileList[0].originFileObj)
      const result = response.data
      messageApi.success(
        `Import completed: total ${result.total}, success ${result.success}, failed ${result.failed}`,
      )
      setFileList([])
    } catch (error) {
      messageApi.error((error as Error).message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Typography.Title level={5} style={{ margin: 0 }}>
          Import Vessel Data
        </Typography.Title>

        <Typography.Paragraph type="secondary">
          Upload one vessel data file. Allowed formats: .xlsx, .xls, .csv. Max size: 10MB.
        </Typography.Paragraph>

        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>

        <Space>
          <Button type="primary" onClick={() => void handleUpload()} loading={loading}>
            Upload
          </Button>
          <Button onClick={() => setFileList([])} disabled={loading || fileList.length === 0}>
            Clear
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default ImportPage
