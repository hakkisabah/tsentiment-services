const {userCache} = require("../models/dynamodb")

const getCache = async (payload)=>{
  // if user_id id not present we use scan and get for user_id
  const data = payload.token
    ? await userCache.scan()
    .where('token').equals(payload.token)
    .exec().promise()
    : await userCache
    .query(`${payload}`)
    .exec().promise();
  const {Items} = data[0];
  if (Items.length > 0) return Items[0].attrs
  return null;
}

const updateUser = async (payload) =>{
  const user = await userCache.update(payload);
  return user.attrs;
}
exports.updateUser = updateUser

const getUser = async (token) => {
  const data = await userCache.scan()
    .where('token').equals(token)
    .exec().promise()
  const {Items} = data[0];
  if (Items.length > 0) return Items[0].attrs
  return null;
}
exports.getUser = getUser

const setUser = async (payload) => {
  return  await updateUser(payload);
}
exports.setUser = setUser


const getKey = async (payload) => {
  try {
    // api service when sending only BEARER token for user its no have a user_id se we implemented for that.
    // for example get endpoint receive this payload => {key:"lRsdfsdfq3jRRvoD7indkEamE7jDjvtyRo5KMApvQ3sJNR64O4E3jv"}
    // in redisToDynamoDB file with getPayload function conver to => {token:"lRsdfsdfq3jRRvoD7indkEamE7jDjvtyRo5KMApvQ3sJNR64O4E3jv"}
    const data = await getCache(payload.user_id?payload.user_id:payload);
    if (data) return data[payload.user_id?payload.key:"user_id"];
    return null;
  }catch (e) {
    console.log(e)
    return null;
  }
}
exports.getKey = getKey;

const saveKey = async (payload) => {
  try {
    const key = Object.keys(payload)[1] // user_id does not postfix in redisToDynamoDB file, so its will be return undefined
    const isExist = await getCache(payload.user_id);
    if (isExist && key !== undefined){
      // reset or remaining keys typeof must be number
      isExist[key] = (key === 'reset' || key === 'remaining') ? +payload[key]: payload[key];
    }
    const user = await updateUser(isExist?isExist:payload);
    return user.attrs
  }catch (e) {
    console.log("error",e)
    return false
  }
}
exports.saveKey = saveKey;