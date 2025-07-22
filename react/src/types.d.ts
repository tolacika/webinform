export interface Subscriber {
  id: number
  name: string
  email: string
  created_at: string
}

export interface FormData {
  name: string
  email: string
}

export interface FormErrors {
  name?: string
  email?: string
}