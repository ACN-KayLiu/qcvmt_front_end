import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Modal, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '@/api/user'
import type { User } from '@/types/user'

interface QueryState {
  page: number
  size: number
  keyword: string
}

const roleColorMap: Record<User['role'], string> = {
  'qcvmt-admin': 'red',
  'qcvmt-user': 'blue',
  'qcvmt-limited': 'gold',
}

const UserList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [query, setQuery] = useState<QueryState>({ page: 1, size: 10, keyword: '' })
  const [inputKeyword, setInputKeyword] = useState('')
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
      messageApi.error((error as Error).message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [messageApi, query.keyword, query.page, query.size])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const handleDelete = useCallback((user: User) => {
    Modal.confirm({
      title: `Delete user ${user.username}?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await userApi.remove(user.id)
          messageApi.success('User deleted')
          await fetchUsers()
        } catch (error) {
          messageApi.error((error as Error).message || 'Delete failed')
        }
      },
    })
  }, [fetchUsers, messageApi])

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
          <Space>
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

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      size: pagination.pageSize || prev.size,
    }))
  }

  const handleSearch = () => {
    setQuery((prev) => ({ ...prev, keyword: inputKeyword.trim(), page: 1 }))
  }

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            User Management
          </Typography.Title>
          <Button type="primary">
            <Link to="/admin/users/new">Create User</Link>
          </Button>
        </Space>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            aria-label="Search users"
            placeholder="Search by username or name"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Space.Compact>

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
      </Space>
    </Card>
  )
}

export default UserList
