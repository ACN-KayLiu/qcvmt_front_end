import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { userApi } from '@/api/user'
import { AdminPageCard } from '@/components/common/AdminPageCard'
import { PageFormActions } from '@/components/common/PageFormActions'
import { usePageMessage } from '@/hooks/usePageMessage'
import type { CreateUserRequest, UpdateUserRequest, User } from '@/types/user'
import { createUserSchema, updateUserSchema } from '@/utils/validators'

type UserFormData = {
  username: string
  qcid: string
  role: User['role']
  parent?: string
}

const roleOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
] as const

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contextHolder, notifyError, notifySuccess } = usePageMessage()
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
      qcid: '',
      role: 'qcvmt-user',
      parent: '',
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
          role: user.role,
          parent: user.parent || '',
        })
      } catch (error) {
        notifyError(error, 'Failed to load user')
      } finally {
        setFetching(false)
      }
    }

    void loadUser()
  }, [id, isEdit, notifyError, reset])

  const onSubmit = async (values: UserFormData) => {
    setLoading(true)
    try {
      if (isEdit && id) {
        const payload: UpdateUserRequest = {
          qcid: values.qcid,
          role: values.role,
          parent: values.parent,
        }
        await userApi.update(Number(id), payload)
        notifySuccess('User updated')
      } else {
        const payload: CreateUserRequest = {
          username: values.username,
          qcid: values.qcid,
          role: values.role,
          parent: values.parent,
        }
        await userApi.create(payload)
        notifySuccess('User created')
      }
      navigate('/admin/users')
    } catch (error) {
      notifyError(error, 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <AdminPageCard
        title={isEdit ? 'Edit User' : 'Create User'}
        subtitle="Maintain account profile, role and QC assignment."
        loading={fetching}
        extra={
          <Button>
            <Link to="/admin/users">Back to List</Link>
          </Button>
        }
      >

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="QCID" validateStatus={errors.qcid ? 'error' : ''} help={errors.qcid?.message}>
            <Controller name="qcid" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

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

          <Form.Item label="Parent" validateStatus={errors.parent ? 'error' : ''} help={errors.parent?.message}>
            <Controller name="parent" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Role" validateStatus={errors.role ? 'error' : ''} help={errors.role?.message}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => <Select {...field} options={roleOptions.map((item) => ({ ...item }))} />}
            />
          </Form.Item>

          <PageFormActions
            submitText={isEdit ? 'Save Changes' : 'Create User'}
            loading={loading}
            onCancel={() => navigate('/admin/users')}
          />
        </Form>
      </AdminPageCard>
    </>
  )
}

export default UserForm
