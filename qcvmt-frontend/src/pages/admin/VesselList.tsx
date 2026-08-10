import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { vesselApi } from '@/api/vessel'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageSearchBar } from '@/components/common/PageSearchBar'
import { useListQuery } from '@/hooks/useListQuery'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { Vessel } from '@/types/vessel'
import { showDeleteConfirm } from '@/utils/deleteConfirm'

const VesselList = () => {
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const { query, inputKeyword, setInputKeyword, handleSearch, handlePageChange } = useListQuery()
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
      notifyError(error, 'Failed to fetch vessels')
    } finally {
      setLoading(false)
    }
  }, [notifyError, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchVessels()
  }, [fetchVessels])

  const handleDelete = useCallback(
    (vessel: Vessel) => {
      showDeleteConfirm({
        title: `Delete vessel ${vessel.vesselId}?`,
        successMessage: 'Vessel deleted',
        onDelete: () => vesselApi.remove(vessel.id),
        onAfterDelete: fetchVessels,
        notifySuccess,
        notifyError,
      })
    },
    [fetchVessels, notifyError, notifySuccess],
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
          <Space className="table-actions" size={8}>
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

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title="Vessel Configuration"
        subtitle="Configure vessel profile and bay/row/tier operating ranges."
        extra={
          <Button type="primary">
            <Link to="/admin/vessels/new">Create Vessel</Link>
          </Button>
        }
      >
        <PageSearchBar
          ariaLabel="Search vessels"
          placeholder="Search by vessel ID or vessel name"
          value={inputKeyword}
          onChange={setInputKeyword}
          onSearch={handleSearch}
        />

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
      </AdminPageCard>
    </>
  )
}

export default VesselList
