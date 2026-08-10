import { useState } from 'react'
import { Button, Space, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { importExportApi } from '@/api/importExport'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { usePageMessage } from '@/hooks/usePageMessage'

const MAX_FILE_SIZE_MB = 10
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv']

const ImportPage = () => {
  const { contextHolder, notifyError, notifySuccess, notifyWarning } = usePageMessage()
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
        notifyError(undefined, `Unsupported file type. Allowed: ${ACCEPTED_EXTENSIONS.join(', ')}`)
        return Upload.LIST_IGNORE
      }

      const isWithinSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      if (!isWithinSize) {
        notifyError(undefined, `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        return Upload.LIST_IGNORE
      }

      return false
    },
    onChange: ({ fileList: nextFileList }) => setFileList(nextFileList),
  }

  const handleUpload = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      notifyWarning('Please select a file to upload')
      return
    }

    setLoading(true)
    try {
      const response = await importExportApi.importVessel(fileList[0].originFileObj)
      const result = response.data
      notifySuccess(
        `Import completed: total ${result.total}, success ${result.success}, failed ${result.failed}`,
      )
      setFileList([])
    } catch (error) {
      notifyError(error, 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Import Vessel Data"
        subtitle="Upload one vessel data file. Allowed formats: .xlsx, .xls, .csv. Max size: 10MB."
      >

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
      </AdminPageCard>
    </>
  )
}

export default ImportPage
