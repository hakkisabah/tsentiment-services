<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title style='cursor: pointer' @click='$router.push("/")'>tsentiment beta
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn to='policy' class='mx-2'>
        Policy
      </v-btn>
      <v-btn to='terms' class='mx-2'>
        Terms
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <router-view />
        </v-row>
      </v-container>
      <v-footer padless>
        <v-col
          class='text-center'
          cols='12'
        >
          <p>tsentiment service is open source software and current codes can be reviewed at <a
            href='https://github.com/hakkisabah/tsentiment-services'>https://github.com/hakkisabah/tsentiment-services</a>.
          </p>
          <p>The reason for the necessity of writing the service is the tsentiment package, which is
            also open sourced at <a href='https://github.com/hakkisabah/tsentiment'>https://github.com/hakkisabah/tsentiment</a>
            and developed in the R programming language.</p>
          <p> All code is open source and so your developments will benefit the development of the
            tsentiment service.</p>
        </v-col>
        <v-col
          class='text-center'
          cols='12'
        >
          {{ new Date().getFullYear() }} — <strong>tsentiment services</strong>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
