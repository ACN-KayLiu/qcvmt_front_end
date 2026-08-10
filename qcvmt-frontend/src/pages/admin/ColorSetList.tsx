import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { colorSetApi } from '@/api/colorSet'
import type { ColorSet } from '@/types/colorSet'

interface QueryState {
  page: number
  size: number
  keyword: string
}

const ColorSetList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState<QueryState>({ page: 1, size: 10, keyword: '' })
  const [inputKeyword, setInputKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ColorSet[]>([])
  const [total, setTotal] = useState(0)

  const fetchColorSets = useCallback(async () => {
    setLoading(true)
    try {
      const response = await colorSetApi.list({
        page: query.page - 1,
        size: query.size,
        keyword: query.keyword || undefined,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      messageApi.error((error as Error).message || 'Failed to fetch color sets')
    } finally {
      setLoading(false)
    }
  }, [messageApi, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchColorSets()
  }, [fetchColorSets])

  const handleDelete = useCallback(
    (colorSet: ColorSet) => {
      Modal.confirm({
        title: `Delete color set ${colorSet.boxCase}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await colorSetApi.remove(colorSet.id)
            messageApi.success('Color set deleted')
            await fetchColorSets()
          } catch (error) {
            messageApi.error((error as Error).message || 'Delete failed')
          }
        },
      })
    },
    [fetchColorSets, messageApi],
  )

  const columns: ColumnsType<ColorSet> = useMemo(
    () => [
      {
        title: 'Box Case',
        dataIndex: 'boxCase',
        key: 'boxCase',
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
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, colorSet) => (
          <Space>
            <Button size="small" onClick={() => navigate(`/admin/color-sets/${colorSet.id}`)}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => handleDelete(colorSet)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleDelete, navigate],
  )

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      keyword: inputKeyword.trim(),
      page: 1,
    }))
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
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Color Set Configuration
          </Typography.Title>
          <Button type="primary">
            <Link to="/admin/color-sets/new">Create Color Set</Link>
          </Button>
        </Space>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            aria-label="Search color sets"
            placeholder="Search by box case"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Space.Compact>

        <Table<ColorSet>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: query.page,
            pageSize: query.size,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} color sets`,
          }}
          onChange={handlePageChange}
        />
      </Space>
    </Card>
  )
}

export default ColorSetList
