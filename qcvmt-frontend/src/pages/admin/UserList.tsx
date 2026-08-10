import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '@/api/user'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageSearchBar } from '@/components/common/PageSearchBar'
import { useListQuery } from '@/hooks/useListQuery'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { User } from '@/types/user'
import { showDeleteConfirm } from '@/utils/deleteConfirm'

const roleColorMap: Record<User['role'], string> = {
  'qcvmt-admin': 'red',
  'qcvmt-user': 'blue',
  'qcvmt-limited': 'gold',
}

const UserList = () => {
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
  const { query, inputKeyword, setInputKeyword, handleSearch, handlePageChange } = useListQuery()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<User[]>([])
  const [total, setTotal] = useState(0)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await userApi.list({
        page: query.page - 1,
        size: query.size,
        keyword: query.keyword || undefined,
      })
      setRows(response.data.content)
      setTotal(response.data.totalElements)
    } catch (error) {
      notifyError(error, 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [notifyError, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const handleDelete = useCallback((user: User) => {
    showDeleteConfirm({
      title: `Delete user ${user.username}?`,
      successMessage: 'User deleted',
      onDelete: () => userApi.remove(user.id),
      onAfterDelete: fetchUsers,
      notifySuccess,
      notifyError,
    })
  }, [fetchUsers, notifyError, notifySuccess])

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'QCID',
        dataIndex: 'qcid',
        key: 'qcid',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (value: User['role']) => <Tag color={roleColorMap[value]}>{value}</Tag>,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, user) => (
          <Space className="table-actions" size={8}>
            <Button size="small" onClick={() => navigate(`/admin/users/${user.id}`)}>
              Edit
            </Button>
            <Button size="small" onClick={() => navigate(`/admin/users/${user.id}/logs`)}>
              Logs
            </Button>
            <Button size="small" danger onClick={() => handleDelete(user)}>
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
        title="User Management"
        subtitle="Manage role assignments and account metadata for control room users."
        extra={
          <Button type="primary">
            <Link to="/admin/users/new">Create User</Link>
          </Button>
        }
      >
        <PageSearchBar
          ariaLabel="Search users"
          placeholder="Search by username or name"
          value={inputKeyword}
          onChange={setInputKeyword}
          onSearch={handleSearch}
        />

        <Table<User>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{
            current: query.page,
            pageSize: query.size,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} users`,
          }}
          onChange={handlePageChange}
        />
      </AdminPageCard>
    </>
  )
}

export default UserList
