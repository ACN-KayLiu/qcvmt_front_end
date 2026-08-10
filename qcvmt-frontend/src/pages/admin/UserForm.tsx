import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { userApi } from '@/api/user'
import type { CreateUserRequest, UpdateUserRequest, User } from '@/types/user'
import { createUserSchema, updateUserSchema } from '@/utils/validators'

type UserFormData = {
  username: string
  password?: string
  qcid: string
  name: string
  role: User['role']
}

const roleOptions = [
  { label: 'Admin', value: 'qcvmt-admin' },
  { label: 'User', value: 'qcvmt-user' },
  { label: 'Limited', value: 'qcvmt-limited' },
] as const

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const isEdit = Boolean(id)

  const resolver = useMemo(
    () => zodResolver(isEdit ? updateUserSchema : createUserSchema),
    [isEdit],
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver,
    defaultValues: {
      username: '',
      password: '',
      qcid: '',
      name: '',
      role: 'qcvmt-user',
    },
  })

  useEffect(() => {
    if (!isEdit || !id) {
      return
    }

    const loadUser = async () => {
      setFetching(true)
      try {
        const response = await userApi.detail(Number(id))
        const user = response.data
        reset({
          username: user.username,
          qcid: user.qcid,
          name: user.name,
          role: user.role,
          password: '',
        })
      } catch (error) {
        messageApi.error((error as Error).message || 'Failed to load user')
      } finally {
        setFetching(false)
      }
    }

    void loadUser()
  }, [id, isEdit, messageApi, reset])

  const onSubmit = async (values: UserFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateUserRequest = {
          username: values.username,
          qcid: values.qcid,
          name: values.name,
          role: values.role,
          ...(values.password ? { password: values.password } : {}),
        }
        await userApi.update(Number(id), payload)
        messageApi.success('User updated')
      } else {
        const payload: CreateUserRequest = {
          username: values.username,
          password: values.password || '',
          qcid: values.qcid,
          name: values.name,
          role: values.role,
        }
        await userApi.create(payload)
        messageApi.success('User created')
      }
      navigate('/admin/users')
    } catch (error) {
      messageApi.error((error as Error).message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card loading={fetching}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {isEdit ? 'Edit User' : 'Create User'}
          </Typography.Title>
          <Button>
            <Link to="/admin/users">Back to List</Link>
          </Button>
        </Space>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => <Input {...field} autoComplete="off" />}
            />
          </Form.Item>

          <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  autoComplete="new-password"
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="QCID" validateStatus={errors.qcid ? 'error' : ''} help={errors.qcid?.message}>
            <Controller name="qcid" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
            <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Role" validateStatus={errors.role ? 'error' : ''} help={errors.role?.message}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => <Select {...field} options={roleOptions.map((item) => ({ ...item }))} />}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
            <Button onClick={() => navigate('/admin/users')}>Cancel</Button>
          </Space>
        </Form>
      </Space>
    </Card>
  )
}

export default UserForm
