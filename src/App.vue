<template>
  <v-app>
    <TopBarNav/>
    <router-view/>
  </v-app>
</template>

<script>
import TopBarNav from '@/components/TopNavigation'
import { mapActions } from "vuex";
export default {
  name: "app",
  components: { TopBarNav },
  data() {
    return {
      user: null,
      //pipe the current data into cards. like here.
      // what data should be passed?
      cards: [
        { text: "floor one" },
        { text: "floor two" },
        { text: "floor three" },
        { text: "floor four" },
        { text: "floor five" },
        { text: "floor six" },
      ],
      items: [
        { title: 'Floor one' },
        { title: 'Floor two' },
        { title: 'Floor three' },
        { title: 'Floor four' },
        { title: 'Floor Five' },
        { title: 'Floor Six' },
      ],
      testFirebaseData: [],
      stallData: [],
      dataInView: [],
      vuexStallData : [],
    };
  },
  mounted() {
    //this.loginUser();
    console.log('mounted  call of vuexstalldata = '+ this.vuexStallData)
    //this.loadFloorsInitally();
            //this.loadFloors();
    //should be able to pass this out right
  },
  created() {
    this.bindUsers();
    this.bindStalls();
  },
  destroyed() {
  },
  computed: {
    userState() {
      console.log('user state is: '+ this.$store.state.currentUser)
      return this.$store.state.currentUser;
    }
  },
  methods: {
    ...mapActions(["loginUser", "bindUsers", "bindStalls"]),
    //we need some type of method : 
    //method: whenever a user joins the app. we should check if any users are tied to an stall.
    //if they are tied to that stall, then we should place a variable "needsToCloseOut"
    //"needsToCloseOut = true" is going to display a full screen  with the timer + "unOccupy" the stall
  },
  watch: {
      //this is only going to load the available data for the current front-end configuration
      //when a firebase collection change occurs..... unless we need to watch for changes in the fb collection to?
     // this.loadFloorData()
  }
};
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
}
.flex {
  display: flex;
  &--center {
    align-items: center;
    justify-items: center;
    justify-content: center;
  }
}
.fixed {
  position: fixed;
  &--center {
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
  }
}
.menuFixed {
    position: fixed;
    
    &--center {
    left: 50%;
    top: 14%;
    transform: translate(-50%, -50%);
  }
}

.menuCard {
  width: 300px;
  height: 45px;
  background-color: #061826;
}
.rounded-borders {
  border-radius: 12px;
}

.menu-rounded-borders {
  border-radius: (12px, 12px, 12px, 0px);
}
.card {
  width: 300px;
  height: 400px;
  color: white;
  &--two {
    width: 280px;
    top: 36%;
  }
  &--three {
    width: 260px;
    top: 37%;
  }
}
</style>
