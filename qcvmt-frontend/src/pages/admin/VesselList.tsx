import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselApi } from '@/api/vessel'
import type { Vessel } from '@/types/vessel'

interface QueryState {
  page: number
  size: number
  keyword: string
}

const VesselList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState<QueryState>({ page: 1, size: 10, keyword: '' })
  const [inputKeyword, setInputKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<Vessel[]>([])
  const [total, setTotal] = useState(0)

  const fetchVessels = useCallback(async () => {
    setLoading(true)
    try {
      const response = await vesselApi.list({
        page: query.page - 1,
        size: query.size,
        keyword: query.keyword || undefined,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      messageApi.error((error as Error).message || 'Failed to fetch vessels')
    } finally {
      setLoading(false)
    }
  }, [messageApi, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchVessels()
  }, [fetchVessels])

  const handleDelete = useCallback(
    (vessel: Vessel) => {
      Modal.confirm({
        title: `Delete vessel ${vessel.vesselId}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await vesselApi.remove(vessel.id)
            messageApi.success('Vessel deleted')
            await fetchVessels()
          } catch (error) {
            messageApi.error((error as Error).message || 'Delete failed')
          }
        },
      })
    },
    [fetchVessels, messageApi],
  )

  const columns: ColumnsType<Vessel> = useMemo(
    () => [
      {
        title: 'Vessel ID',
        dataIndex: 'vesselId',
        key: 'vesselId',
      },
      {
        title: 'Vessel Name',
        dataIndex: 'vesselName',
        key: 'vesselName',
      },
      {
        title: 'Deck/Hold',
        dataIndex: 'deckHold',
        key: 'deckHold',
        render: (value: string) => <Tag color={value === 'DECK' ? 'cyan' : 'purple'}>{value}</Tag>,
      },
      {
        title: 'Bay',
        key: 'bayRange',
        render: (_, vessel) => `${vessel.bayStart}-${vessel.bayEnd}`,
      },
      {
        title: 'Row',
        key: 'rowRange',
        render: (_, vessel) => `${vessel.rowStart}-${vessel.rowEnd}`,
      },
      {
        title: 'Tier',
        key: 'tierRange',
        render: (_, vessel) => `${vessel.tierStart}-${vessel.tierEnd}`,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, vessel) => (
          <Space>
            <Button size="small" onClick={() => navigate(`/admin/vessels/${vessel.id}`)}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => handleDelete(vessel)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleDelete, navigate],
  )

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      size: pagination.pageSize || prev.size,
    }))
  }

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      keyword: inputKeyword.trim(),
      page: 1,
    }))
  }

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Vessel Configuration
          </Typography.Title>
          <Button type="primary">
            <Link to="/admin/vessels/new">Create Vessel</Link>
          </Button>
        </Space>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            aria-label="Search vessels"
            placeholder="Search by vessel ID or vessel name"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Space.Compact>

        <Table<Vessel>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: query.page,
            pageSize: query.size,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} vessels`,
          }}
          onChange={handlePageChange}
        />
      </Space>
    </Card>
  )
}

export default VesselList
