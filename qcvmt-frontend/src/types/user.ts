export type Role = 'qcvmt-admin' | 'qcvmt-user' | 'qcvmt-limited'

export interface User {
  id: number
  username: string
  qcid: string
  name: string
  role: Role
  parent?: string
}

export interface CreateUserRequest {
  username: string
  password: string
  qcid: string
  name: string
  role: Role
}

export interface UpdateUserRequest extends Omit<CreateUserRequest, 'password'> {
  password?: string
}

export interface OperationLogItem {
  id: number
  actionType: string
  functionName: string
  valueChange: string
  time: string
}
