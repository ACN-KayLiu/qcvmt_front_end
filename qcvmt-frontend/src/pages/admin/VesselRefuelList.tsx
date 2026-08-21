import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselRefuelApi } from '@/api/vesselRefuel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageSearchBar } from '@/components/common/PageSearchBar'
import { useListQuery } from '@/hooks/useListQuery'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { VesselRefuelItem } from '@/types/bayConfig'
import { showDeleteConfirm } from '@/utils/deleteConfirm'

const VesselRefuelList = () => {
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const { query, inputKeyword, setInputKeyword, handleSearch, handlePageChange } = useListQuery()
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
      notifyError(error, 'Failed to fetch refuel records')
    } finally {
      setLoading(false)
    }
  }, [notifyError, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchRows()
  }, [fetchRows])

  const handleDelete = useCallback(
    (item: VesselRefuelItem) => {
      showDeleteConfirm({
        title: `Delete refuel record for ${item.vesselId}?`,
        successMessage: 'Refuel record deleted',
        onDelete: () => vesselRefuelApi.remove(item.id),
        onAfterDelete: fetchRows,
        notifySuccess,
        notifyError,
      })
    },
    [fetchRows, notifyError, notifySuccess],
  )

  const columns: ColumnsType<VesselRefuelItem> = useMemo(
    () => [
      { title: 'Vessel ID', dataIndex: 'vesselId', key: 'vesselId' },
      {
        title: 'Status',
        dataIndex: 'isRefuel',
        key: 'isRefuel',
        render: (value: string) => (value === 'Y' ? <Tag color="red">Refuel</Tag> : <Tag color="green">Normal</Tag>),
      },
      {
        title: 'Toggle Preview',
        key: 'toggle',
        render: (_, row) => <Switch checked={row.isRefuel === 'Y'} disabled aria-label={`Refuel switch for ${row.vesselId}`} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, row) => (
          <Space className="table-actions" size={8}>
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

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Vessel Refuel Status"
        subtitle="Track temporary refuel flags and keep dispatch state synchronized."
        extra={
          <Button type="primary">
            <Link to="/admin/vessel-refuels/new">Create Refuel Record</Link>
          </Button>
        }
      >
        <PageSearchBar
          ariaLabel="Search vessel refuels"
          placeholder="Search by vessel ID"
          value={inputKeyword}
          onChange={setInputKeyword}
          onSearch={handleSearch}
        />

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
      </AdminPageCard>
    </>
  )
}

export default VesselRefuelList
