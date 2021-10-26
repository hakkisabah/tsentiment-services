<template>
  <v-container v-if='userToken !== "-"'>
    <v-card class='text-center'>
      userToken :
      <v-card-text color='info'>
        {{ userToken }}
      </v-card-text>
    </v-card>
    <v-list class='d-flex justify-center'>
    <v-card class='text-center mx-2'>
      <v-btn
        x-large
        color='success'
        dark
        @click='Log_out()'
      >
        Logout
      </v-btn>
    </v-card>
    <v-card class='text-center mx-2'>
      <v-btn
        v-if='!isDisabled'
        x-large
        color='success'
        dark
        @click='refreshAppToken()'
        :disabled='isDisabled'
      >
        Refresh App Token
      </v-btn>
      <v-btn
        v-else
        x-large
        color='warning'
        dark
      >
        Refreshing..
      </v-btn>
    </v-card>
    </v-list>
  </v-container>
</template>

<script>
import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};
export default {
  name: 'Panel',
  data() {
    return {
      isDisabled: false,
      userToken: '-',
    };
  },
  // eslint-disable-next-line require-await,consistent-return
  async beforeMount() {
    const isCookie = this.$cookies.get('sentimentuser');
    headers.Authorization = `Bearer ${isCookie}`;
    if (isCookie) {
      return axios.get(`${process.env.VUE_APP_OAUTH_SERVER_URL}panel`, { headers })
        .then((response) => {
          this.$cookies.set('isAuth', 1);
          this.userToken = response.data.data.token;
        })
        .catch(() => this.Log_out());
    }
    this.Log_out();
  },
  methods: {
    Log_out() {
      this.$cookies.remove('sentimentuser');
      this.$cookies.set('isAuth', 0);
      this.$router.push('/');
    },
    // eslint-disable-next-line consistent-return
    refreshAppToken() {
      this.isDisabled = true;
      const isCookie = this.$cookies.get('sentimentuser');
      headers.Authorization = `Bearer ${isCookie}`;
      if (isCookie) {
        this.userToken = 'refreshing...';
        return axios.get(`${process.env.VUE_APP_OAUTH_SERVER_URL}refreshapptoken`, { headers })
          .then((response) => {
            this.isDisabled = false;
            this.userToken = response.data.data.token;
          })
          .catch(() => this.Log_out());
      }
      this.Log_out();
    },
  },
};
</script>

<style scoped>

</style>
