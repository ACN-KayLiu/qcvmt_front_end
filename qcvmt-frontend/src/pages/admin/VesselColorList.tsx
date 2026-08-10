import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselColorApi } from '@/api/vesselColor'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageSearchBar } from '@/components/common/PageSearchBar'
import { useListQuery } from '@/hooks/useListQuery'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { VesselColorItem } from '@/types/bayConfig'
import { showDeleteConfirm } from '@/utils/deleteConfirm'

const VesselColorList = () => {
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const { query, inputKeyword, setInputKeyword, handleSearch, handlePageChange } = useListQuery()
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
      notifyError(error, 'Failed to fetch vessel colors')
    } finally {
      setLoading(false)
    }
  }, [notifyError, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchRows()
  }, [fetchRows])

  const handleDelete = useCallback(
    (item: VesselColorItem) => {
      showDeleteConfirm({
        title: `Delete vessel color for ${item.vesselId}?`,
        successMessage: 'Vessel color deleted',
        onDelete: () => vesselColorApi.remove(item.id),
        onAfterDelete: fetchRows,
        notifySuccess,
        notifyError,
      })
    },
    [fetchRows, notifyError, notifySuccess],
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
          <Space className="table-actions" size={8}>
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

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Vessel Color Configuration"
        subtitle="Define color mapping by vessel and bay range for operation visualization."
        extra={
          <Button type="primary">
            <Link to="/admin/vessel-colors/new">Create Vessel Color</Link>
          </Button>
        }
      >
        <PageSearchBar
          ariaLabel="Search vessel colors"
          placeholder="Search by vessel ID"
          value={inputKeyword}
          onChange={setInputKeyword}
          onSearch={handleSearch}
        />

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
      </AdminPageCard>
    </>
  )
}

export default VesselColorList
