import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { colorSetApi } from '@/api/colorSet'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageSearchBar } from '@/components/common/PageSearchBar'
import { useListQuery } from '@/hooks/useListQuery'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { ColorSet } from '@/types/colorSet'
import { showDeleteConfirm } from '@/utils/deleteConfirm'

const ColorSetList = () => {
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const { query, inputKeyword, setInputKeyword, handleSearch, handlePageChange } = useListQuery()
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
      notifyError(error, 'Failed to fetch color sets')
    } finally {
      setLoading(false)
    }
  }, [notifyError, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchColorSets()
  }, [fetchColorSets])

  const handleDelete = useCallback(
    (colorSet: ColorSet) => {
      showDeleteConfirm({
        title: `Delete color set ${colorSet.boxcase}?`,
        successMessage: 'Color set deleted',
        onDelete: () => colorSetApi.remove(colorSet.id),
        onAfterDelete: fetchColorSets,
        notifySuccess,
        notifyError,
      })
    },
    [fetchColorSets, notifyError, notifySuccess],
  )

  const columns: ColumnsType<ColorSet> = useMemo(
    () => [
      {
        title: 'Box Case',
        dataIndex: 'boxcase',
        key: 'boxcase',
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
        render: (_, colorSet) => (
          <Space className="table-actions" size={8}>
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

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Color Set Configuration"
        subtitle="Maintain color palettes used by bay planning and container state mapping."
        extra={
          <Button type="primary">
            <Link to="/admin/color-sets/new">Create Color Set</Link>
          </Button>
        }
      >
        <PageSearchBar
          ariaLabel="Search color sets"
          placeholder="Search by box case"
          value={inputKeyword}
          onChange={setInputKeyword}
          onSearch={handleSearch}
        />

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
      </AdminPageCard>
    </>
  )
}

export default ColorSetList
