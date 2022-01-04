<template>
  <v-app>
    <TopBarNav :navName="$route.name"/>
    <router-view :displayNotification="displayNotification" :displayMsg="displayMsg"/>
  </v-app>
</template>

<script>
import TopBarNav from '@/components/TopNavigation'
import { mapActions, mapState } from "vuex";
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
      displayNotification: false,
      displayMsg: '',
      count: 0
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
    this.bindRecentActivity();
  },
  destroyed() {
  },
  computed: {
    userState() {
      console.log('user state is: '+ this.$store.state.currentUser)
      return this.$store.state.currentUser;
    },
    ...mapState(['recentActivity'])
  },
  methods: {
    ...mapActions(["loginUser", "bindUsers", "bindStalls", 'bindRecentActivity']),

    getNotificationText(){

    }
    //we need some type of method : 
    //method: whenever a user joins the app. we should check if any users are tied to an stall.
    //if they are tied to that stall, then we should place a variable "needsToCloseOut"
    //"needsToCloseOut = true" is going to display a full screen  with the timer + "unOccupy" the stall
  },
  watch: {
    recentActivity() {
      if(this.count >0) {
      var latestUpdate = this.recentActivity[0];
      var sentence = '';
      console.log(latestUpdate);
      if(latestUpdate.type == "stallChange") {
        //the occupied status change 
        if(latestUpdate.newStatus == true) {
          //occupied status is now occupied
          sentence = 'A user occupied stall: '+latestUpdate.stallID
        }
        else if(latestUpdate.newStatus == false) {
          //occupied status is now occupied
          sentence = 'A user left stall: '+latestUpdate.stallID
        }
      }
      else if(latestUpdate.type == "reservationChange") {
        //the occupied status change 
        sentence = 'A user reserved stall: '+latestUpdate.stallID+ ' at 10:35pm'
      }
      if(sentence != ''){
        console.log('sending notification '+ sentence);
        this.displayMsg = sentence;
        if(this.displayNotification == false){
          this.displayNotification = true;
          setTimeout(() => {
          this.displayNotification = false
        }, 3200)
        }
      }
      else if(sentence == ''){
        console.error('cannot change the notification because sentence is null')
      }
      }
      else {
        this.count++;
      }
    }
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
