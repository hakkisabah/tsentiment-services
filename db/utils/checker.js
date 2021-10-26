exports.saveChecker = (request) => {
  try {
    if (
      !request.body.user_id
      ||
      !request.body.screen_name
      ||
      !request.body.email
      ||
      !request.body.twitterOauthTokens
      ||
      !request.body.twitterOauthTokens.oAuthAccessToken
      ||
      !request.body.twitterOauthTokens.oAuthAccessTokenSecret
    ) {
      return false
    } else {
      const { user_id, screen_name,email, twitterOauthTokens } = request.body
      return {
        user_id,
        screen_name,
        email,
        twitterOauthTokens
      }
    }
  } catch (e) {
    return false
  }
}