import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselRefuelApi } from '@/api/vesselRefuel'
import type { VesselRefuelItem } from '@/types/bayConfig'

interface QueryState {
  page: number
  size: number
  keyword: string
}

const VesselRefuelList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState<QueryState>({ page: 1, size: 10, keyword: '' })
  const [inputKeyword, setInputKeyword] = useState('')
  const [rows, setRows] = useState<VesselRefuelItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const response = await vesselRefuelApi.list({
        page: query.page - 1,
        size: query.size,
        keyword: query.keyword || undefined,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      messageApi.error((error as Error).message || 'Failed to fetch refuel records')
    } finally {
      setLoading(false)
    }
  }, [messageApi, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchRows()
  }, [fetchRows])

  const handleDelete = useCallback(
    (item: VesselRefuelItem) => {
      Modal.confirm({
        title: `Delete refuel record for ${item.vesselId}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await vesselRefuelApi.remove(item.id)
            messageApi.success('Refuel record deleted')
            await fetchRows()
          } catch (error) {
            messageApi.error((error as Error).message || 'Delete failed')
          }
        },
      })
    },
    [fetchRows, messageApi],
  )

  const columns: ColumnsType<VesselRefuelItem> = useMemo(
    () => [
      { title: 'Vessel ID', dataIndex: 'vesselId', key: 'vesselId' },
      {
        title: 'Status',
        dataIndex: 'isRefuel',
        key: 'isRefuel',
        render: (value: boolean) => (value ? <Tag color="red">Refuel</Tag> : <Tag color="green">Normal</Tag>),
      },
      {
        title: 'Toggle Preview',
        key: 'toggle',
        render: (_, row) => <Switch checked={row.isRefuel} disabled aria-label={`Refuel switch for ${row.vesselId}`} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, row) => (
          <Space>
            <Button size="small" onClick={() => navigate(`/admin/vessel-refuels/${row.id}`)}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => handleDelete(row)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleDelete, navigate],
  )

  const handleSearch = () => {
    setQuery((prev) => ({ ...prev, keyword: inputKeyword.trim(), page: 1 }))
  }

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      size: pagination.pageSize || prev.size,
    }))
  }

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Vessel Refuel Status
          </Typography.Title>
          <Button type="primary">
            <Link to="/admin/vessel-refuels/new">Create Refuel Record</Link>
          </Button>
        </Space>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            aria-label="Search vessel refuels"
            placeholder="Search by vessel ID"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Space.Compact>

        <Table<VesselRefuelItem>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: query.page,
            pageSize: query.size,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} refuel records`,
          }}
          onChange={handlePageChange}
        />
      </Space>
    </Card>
  )
}

export default VesselRefuelList
