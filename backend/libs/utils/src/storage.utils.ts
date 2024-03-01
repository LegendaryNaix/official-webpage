export const formatFileUrl = (src: string) => {
  const baseUrl = process.env.CDN_BASE_URL
  const prefix =
    process.env.NODE_ENV === 'production'
      ? '/'
      : `/${process.env.AWS_CDN_BUCKET_NAME}/`

  return baseUrl + prefix + src
}
