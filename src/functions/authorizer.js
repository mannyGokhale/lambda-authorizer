const ALLOWED_TOKENS = ['e60fcb2', '12345TestToken']
const getDynamicResourceArns = (methodArn) => {
  const methodArnSplitArr = methodArn.split('/')
  let allowedResources = []
  if (methodArnSplitArr && methodArnSplitArr.length > 3) {
    const resourcePrefix = methodArnSplitArr[0]
    const stage = methodArnSplitArr[1]
    const method =  methodArnSplitArr[2]
    const getResourcePath = `${resourcePrefix}/${stage}/${method}/*`
    allowedResources.push(
      getResourcePath
    )
  }
  return allowedResources
}

const extractAuthTokenFromHeader = (headers) => {
  const { Authorization } = headers
  const [key, val] = Authorization.split(' ')
  if (key && key.toLowerCase() === 'bearer' && val) {
    return val
  } else {
    log(MODULE, 'extractAuthTokenFromHeader', 'Error', 'Error while authorizing token', { Authorization })
    throw new Error('Invalid auth token')
  }
}

const authorizationPolicy = (event) => {
  const { methodArn } = event
  const resources = getDynamicResourceArns(methodArn)
  console.log(resources);

  return {
    'principalId': 12345,
    'policyDocument': {
      'Version': '2012-10-17',
      'Statement': [{
        'Effect': 'Allow',
        'Action': 'execute-api:Invoke',
        'Resource': resources
      }]
    }
  }
}

const isTokenValid = (token) => ALLOWED_TOKENS.includes(token)

module.exports.handler = async (event, context) => {
  console.log(event)
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const authToken = extractAuthTokenFromHeader(event.headers)
    console.log(authToken);
    if (isTokenValid(authToken)) {
      const resources = authorizationPolicy(event)
      return resources
    } else {
      throw new Error('Invalid auth token')
    }
  } catch (error) {
    console.log(error)
    throw new Error('Unauthorized')
  }
}
