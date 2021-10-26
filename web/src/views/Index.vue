<template>
  <v-container>
    <v-card class='text-center'>
      <v-btn
        v-if="authLink !== '#'"
        x-large
        color='success'
        dark
        :href='authLink'
        :disabled='authLink === "#"'
      >
        Auth With Twitter
      </v-btn>
      <v-btn
        v-else
        x-large
        color='warning'
        dark
        :href='authLink'
      >
        Getting auth key..
      </v-btn>
    </v-card>
  </v-container>
</template>
<script>
import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};
export default {
  name: 'Index',
  data() {
    return {
      authLink: '#',
    };
  },
  // eslint-disable-next-line consistent-return
  created() {
    const logInfo = {
      servicename: 'web',
      file: 'pages/index.vue',
      clientInfo: { useragent: this.$ua },
    };
    try {
      const isCookie = this.$cookies.get('isAuth');
      headers.Authorization = `Bearer ${isCookie}`;
      logInfo.line = 35;
      logInfo.logdata = 'client request code';
      logInfo.type = 'info';
      if (+isCookie === 0) {
        return axios.get(`${process.env.VUE_APP_OAUTH_SERVER_URL}getcode`, { headers })
          .then((response) => {
            if (response.data.data.oauth_callback_confirmed) {
              this.$cookies.set('oauth', response.data.data.cookie);
              this.$cookies.set('isAuth', 0);
              this.authLink = process.env.VUE_APP_TWITTER_OAUTH_URL + response.data.data.oAuthToken;
            } else {
              logInfo.line = 46;
              logInfo.logdata = 'oauth_callback_confirmed error';
              logInfo.type = 'error';
              this.authLink = '#';
            }
          })
          .catch((error) => {
            logInfo.line = 55;
            logInfo.logdata = error;
            logInfo.type = 'error';
            this.authLink = '#';
          });
      }
      return this.$router.push('/panel');
    } catch (e) {
      logInfo.line = 67;
      logInfo.logdata = e;
      logInfo.type = 'error';
      this.authLink = '#';
    }
  },
};
</script>
