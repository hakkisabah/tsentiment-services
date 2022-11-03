const keyConversion = {
  "reset": () => "reset",
  "token": () => "token",
  "twitter_access_token": () => "twitterAccessToken",
  "twitter_access_token_secret": () => "twitterAccessTokenSecret",
}
const checkKey = (key) => keyConversion[key.join("_")];
// analyzeAndGetPayload will be optimized
const analyzeAndGetPayload = (payload) => {
  if (!isNaN(payload.key)) {
    return {
      user_id: payload.key,
      key: "user_id",
    }
  }
  const key = payload.key.split("_")
  if (key.length > 1) {
    const uid = key.shift() // its return the first element of the array and its user_id
    const isConversioned = checkKey(key)
    if (isConversioned) {
      return {
        user_id: uid,
        key:isConversioned(),
      };
    } else {
      return false;
    }
  } else {
    // if key.length === 1 and key[0] is not number then we know api services calling and find for user_id
    return payload.value ? { user_id: payload.value, token: payload.key, key: "token" }:{token:payload.key};
  }
}

exports.getPayload = (payload) => {
  const isKey = analyzeAndGetPayload(payload)
  if (isKey) {
    // if payload has a name of value key it calling from post method
    // else it's calling from get method
    return payload.value ? {
      user_id: isKey.user_id,
      [isKey.key]: isKey.token ? isKey.token : payload.value
    } : isKey
  } else {
    return false
  }
}