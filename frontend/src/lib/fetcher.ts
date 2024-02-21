import { auth } from '@/lib/auth'
import { HttpStatus } from './http-status'

const fetcher = {
  get<T>(url: string, cache = true): Promise<T> {
    return this.customFetch(url, 'GET', undefined, cache)
  },
  post<T>(url: string, body = {}, cache = false): Promise<T> {
    return this.customFetch(url, 'POST', body, cache)
  },
  put<T>(url: string, body = {}, cache = false): Promise<T> {
    return this.customFetch(url, 'PUT', body, cache)
  },
  patch<T>(url: string, body = {}, cache = false): Promise<T> {
    return this.customFetch(url, 'PATCH', body, cache)
  },
  delete<T>(url: string, body = {}, cache = false): Promise<T> {
    return this.customFetch(url, 'DELETE', body, cache)
  },
  async customFetch<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body = {},
    cache = true,
    retry = false
  ): Promise<T> {
    const session = await auth()

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: session ? session.token.accessToken : ''
      },
      body:
        method !== 'GET' && method !== 'DELETE'
          ? JSON.stringify(body)
          : undefined,
      cache: cache ? 'default' : 'no-store'
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === HttpStatus.UNAUTHORIZED && !retry) {
        const session = await auth()
        if (session) {
          // retry request
          return this.customFetch<T>(url, method, body, cache, true)
        }
      }

      throw new Error(data.message ?? 'Something went wrong')
    }

    return data as T
  }
}

export default fetcher
