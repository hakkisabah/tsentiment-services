<template>
  <v-container>
    <v-card class='text-center'>
      <v-card-text>Retrieving information..</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};
export default {
  name: 'callback',
  data() {
    return {
      oauthSecret: null,
      oauth_token: null,
      oauth_verifier: null,
    };
  },
  async beforeCreate() {
    const isCookie = this.$cookies.get('oauth');
    headers.Authorization = `Bearer ${isCookie}`;
    return axios.get(`${process.env.VUE_APP_OAUTH_SERVER_URL}callback?oauth_token=${this.$route.query.oauth_token}&oauth_verifier=${this.$route.query.oauth_verifier}`, { headers })
      .then((res) => {
        if (res.data.data) {
          this.$cookies.set('sentimentuser', res.data.data);
          this.$router.push('/panel');
        } else {
          this.refreshToken();
        }
      })
      .catch((e) => {
        console.log('e >', e);
        this.refreshToken();
      });
  },
  methods: {
    refreshToken() {
      this.$cookies.remove('sentimentuser');
      this.$cookies.set('isAuth', 0);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>

</style>
