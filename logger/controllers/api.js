exports.api = async (request, response) => {
  const logInfo = {
    servicename: request.body.servicename?request.body.servicename:'unknown',
    file: request.body.file?request.body.file:'unknown',
    line: request.body.line?request.body.line:'unknown',
    clientInfo: request.body.clientInfo?request.body.clientInfo:'unknown',
    logdata: request.body.logdata?request.body.logdata:'unknown',
    type: request.body.type?request.body.type:'unknown'
  }
  try {
    return response.sendData('ok', logInfo)
  }catch (e) {
    return response.sendError('Parameter error', 400, logInfo)
  }
}