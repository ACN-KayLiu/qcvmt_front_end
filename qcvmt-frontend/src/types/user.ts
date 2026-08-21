export type Role = 'qcvmt-admin' | 'qcvmt-user' | 'qcvmt-limited'

export interface User {
  id: number
  keycloakId?: string
  username: string
  qcid: string
  name?: string
  role: Role | string
  parent?: string
  createTime?: string
}

export interface CreateUserRequest {
  username: string
  qcid: string
  role: string
  parent?: string
}

export interface UpdateUserRequest {
  qcid: string
  role: string
  parent?: string
}

export interface OperationLogItem {
  id: number
  userId: number
  username: string
  actionType: string
  functionName: string
  oldValues?: string
  newValues?: string
  timestamp: string
}
