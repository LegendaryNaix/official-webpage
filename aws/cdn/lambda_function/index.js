// 특정 도메인에서 오는 요청만 허용함
exports.handler = async (event) => {
  const allowedDomain = 'skku-royals.com'
  const domainName = event.Records[0].cf.request.headers['host'][0].value

  if (domainName !== allowedDomain) {
    return {
      status: '403',
      statusDescription: 'Forbidden',
      body: 'Access denied'
    }
  }

  return event.Records[0].cf.request
}
