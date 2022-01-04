<template>
    <v-card class="mx-auto menuFixed menuFixed--center" style="z-index: 4">
          <v-app-bar
      color="deep-purple"
      dark
      width="300px"
      height="45px"
      style="z-index: 4"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
<v-navigation-drawer
      v-model="drawer"
      temporary
      absolute
      style="margin-top:10px;"
      height="150px"
      width="245px"
      
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title><router-link to="/">Home</router-link></v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title><router-link to="/activity">Recent Activity</router-link></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-calendar-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-title><router-link to="/reservations">View Reservations</router-link></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

      <v-toolbar-title v-if="navName === 'Home'">Insider Stall</v-toolbar-title>
      <v-toolbar-title v-if="navName === 'Activity'">Recent Activity</v-toolbar-title>
      <v-toolbar-title v-else-if="navName === 'Reservations'">Reservations</v-toolbar-title>
            <v-spacer></v-spacer>

      <v-btn icon v-if="!drawer">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn v-if="drawer" icon>
        <v-icon>mdi-arrow-expand-right</v-icon>
      </v-btn>
    </v-app-bar>
    </v-card>
</template>

<script>
export default {
    name: 'top-bar-nav',

data() {
    return {
    drawer: false,
    group: null,
    }
},
props: {
  navName: {
    type: String
  }
}
}
</script>

<style>
.centerElem {
  left: 30%;
  position: fixed;
}
</style>
