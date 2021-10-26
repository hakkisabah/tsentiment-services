exports.propChecker = (request) => {
  try {
    if (
      !request.body.servicename
      ||
      !request.body.file
      ||
      !request.body.line
      ||
      !request.body.clientInfo
      ||
      !request.body.logdata
      ||
      !request.body.type
    ) {
      const falsyRequest = {
        servicename: request.body.servicename ? `${request.body.servicename} and logger` : 'unknown',
        file: request.body.file ? request.body.file : 'unknown',
        line: request.body.line ? request.body.line : 'unknown',
        logdata: 'catch by logger server this request has invalid body',
        type: 'error'
      }
      return { falsyRequest }
    } else {
      return request
    }
  } catch (e) {
    return {
      servicename: 'unknown',
      file: 'utils/checker.js',
      line: 31,
      logdata: 'checker error',
      type: 'error'
    }
  }

}