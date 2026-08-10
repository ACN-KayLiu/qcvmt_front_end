import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselColorApi } from '@/api/vesselColor'
import type { VesselColorItem } from '@/types/bayConfig'

interface QueryState {
  page: number
  size: number
  keyword: string
}

const VesselColorList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState<QueryState>({ page: 1, size: 10, keyword: '' })
  const [inputKeyword, setInputKeyword] = useState('')
  const [rows, setRows] = useState<VesselColorItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const response = await vesselColorApi.list({
        page: query.page - 1,
        size: query.size,
        keyword: query.keyword || undefined,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      messageApi.error((error as Error).message || 'Failed to fetch vessel colors')
    } finally {
      setLoading(false)
    }
  }, [messageApi, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchRows()
  }, [fetchRows])

  const handleDelete = useCallback(
    (item: VesselColorItem) => {
      Modal.confirm({
        title: `Delete vessel color for ${item.vesselId}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await vesselColorApi.remove(item.id)
            messageApi.success('Vessel color deleted')
            await fetchRows()
          } catch (error) {
            messageApi.error((error as Error).message || 'Delete failed')
          }
        },
      })
    },
    [fetchRows, messageApi],
  )

  const columns: ColumnsType<VesselColorItem> = useMemo(
    () => [
      { title: 'Vessel ID', dataIndex: 'vesselId', key: 'vesselId' },
      {
        title: 'Bay',
        key: 'bayRange',
        render: (_, row) => `${row.bayStart}-${row.bayEnd}`,
      },
      {
        title: 'Row',
        key: 'rowRange',
        render: (_, row) => `${row.rowStart}-${row.rowEnd}`,
      },
      {
        title: 'Tier',
        key: 'tierRange',
        render: (_, row) => `${row.tierStart}-${row.tierEnd}`,
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        render: (value: string) => (
          <Space>
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: '1px solid #ddd',
                backgroundColor: value,
                display: 'inline-block',
              }}
            />
            <Tag>{value}</Tag>
          </Space>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, row) => (
          <Space>
            <Button size="small" onClick={() => navigate(`/admin/vessel-colors/${row.id}`)}>
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
            Vessel Color Configuration
          </Typography.Title>
          <Button type="primary">
            <Link to="/admin/vessel-colors/new">Create Vessel Color</Link>
          </Button>
        </Space>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            aria-label="Search vessel colors"
            placeholder="Search by vessel ID"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Space.Compact>

        <Table<VesselColorItem>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: query.page,
            pageSize: query.size,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} vessel color records`,
          }}
          onChange={handlePageChange}
        />
      </Space>
    </Card>
  )
}

export default VesselColorList
