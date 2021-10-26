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
