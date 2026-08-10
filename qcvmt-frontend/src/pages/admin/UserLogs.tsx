import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useParams } from 'react-router-dom'
import { userApi } from '@/api/user'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { OperationLogItem } from '@/types/user'
import { formatDateTime } from '@/utils/format'

const UserLogs = () => {
  const { id } = useParams()
  const { contextHolder, notifyError } = usePageMessage()
  const [rows, setRows] = useState<OperationLogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async () => {
    if (!id) {
      return
    }

    setLoading(true)
    try {
      const response = await userApi.logs(Number(id), {
        page: page - 1,
        size: pageSize,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      notifyError(error, 'Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }, [id, notifyError, page, pageSize])

  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  const columns: ColumnsType<OperationLogItem> = useMemo(
    () => [
      {
        title: 'Action',
        dataIndex: 'actionType',
        key: 'actionType',
        render: (value: string) => <Tag>{value}</Tag>,
      },
      {
        title: 'Function',
        dataIndex: 'functionName',
        key: 'functionName',
      },
      {
        title: 'Change',
        dataIndex: 'valueChange',
        key: 'valueChange',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (value: string) => formatDateTime(value),
      },
    ],
    [],
  )

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1)
    setPageSize(pagination.pageSize || 10)
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="User Operation Logs"
        subtitle="Audit actions performed by the selected user account."
        extra={
          <Button>
            <Link to="/admin/users">Back to Users</Link>
          </Button>
        }
      >

        <Table<OperationLogItem>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} records`,
          }}
          onChange={handlePageChange}
        />
      </AdminPageCard>
    </>
  )
}

export default UserLogs
