import { auth } from '@/lib/auth'
import { HttpStatus } from './http-status'
import { API_BASE_URL } from './vars'

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

    const response = await fetch(API_BASE_URL + url, {
      method,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
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
        // when accessToken expired refresh accessToken
        const session = await auth()
        if (session) {
          // retry origin request
          return this.customFetch<T>(url, method, body, cache, true)
        }
      }

      throw new Error('fetch failed')
    }

    return data as T
  }
}

export default fetcher
