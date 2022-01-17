<template>
    <v-main class="container">
      <div v-if="displayNotification" class="moveSnackbar" style="z-index: 10">
        <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      style="z-index: 10; padding-top: 13%"
      max-width="300"
      min-width="300"
      min-height="35"
      max-height="35"
      top
    >
      {{ displayMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
      </div>
        <div class="occupiedFixed occupiedFixed--center card" style="z-index: 3" v-if="userOccupiesStall">
          <FloorCardOccupied @unoccupyStall="onUnoccupy"/>
      </div>
      <div class="fixed fixed--center" style="z-index: 3" v-if="!userOccupiesStall">
        <Vue2InteractDraggable
          v-if="isVisible"
          :interact-x-threshold="100" 
          @draggedRight="accept"
          @draggedLeft="decline"
          class="rounded-borders card"
        >
          <FloorCard @clicked="onGenderSwitch" :floor_num="index" :metrics="floorMetrics" @bookingReservation="onBookingReservation" @booking="onBooking" @reportOccupied="onReportOccupied" :title="current.text" :storeFloorStalls="stallsVueFire"/>
        </Vue2InteractDraggable>
      </div>
    <div
      v-if="next && !userOccupiesStall"
      class="rounded-borders card card--two fixed fixed--center"
      style="z-index: 2">
      <FloorCard :title="next.text" />
    </div>
    </v-main>
</template>

<script>
import { Vue2InteractDraggable } from "vue2-interact";
import FloorCard from '@/components/FloorCard'
import { mapGetters, mapActions, mapMutations } from "vuex";
import FloorCardOccupied from '@/components/FloorCardOccupied'
import axios from 'axios'

export default {
    name: 'floor-card-home',
    components: { Vue2InteractDraggable, FloorCard, FloorCardOccupied },
    props: ['displayNotification', 'displayMsg'],
  data() {
    return {
      isVisible: true,
      index: 0,
      user: null,
      selection: 1,
      genderSelected : 'b',
      drawer: false,
      group: null,
      floorMetrics: null,
      exampleText: 'a computed should do well here',
      timeout: 3000,
      snackbar: true,
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
    axios.get(`https://metrics-ooqigdh2aa-uc.a.run.app/count?floor=${this.index+1}&time=3`).then(response => (this.floorMetrics = response.data))
    console.log('mounted  call of vuexstalldata = '+ this.vuexStallData)
    //this.loadFloorsInitally();
            //this.loadFloors();
    //should be able to pass this out right
  },
  created() {
    //this.loginUser();
    this.loginUser();
    this.unsubscribeStallData = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'set_current_floor_increment' || 
          mutation.type === 'set_current_floor_decrement' ||
          mutation.type === 'set_current_gender') {
            //do the normal logic to update the state specific stall info
            // awesome resource: https://dev.to/viniciuskneves/watch-for-vuex-state-changes-2mgj
            console.log("logging vuex state variable"+ state);
            this.vuexStallData = this.stallState;
            console.log(this.vuexStallData);
          }
    })
  },
  destroyed() {
    this.unsubscribeStallData();
  },
  computed: {
    userState() {
      console.log('user state is: '+ this.$store.state.currentUser)
      return this.$store.state.currentUser;
    },
    current() {
      return this.cards[this.index];
    },
    next() {
      return this.cards[this.index + 1]
    },
    userOccupiesStall(){
      return this.userOccupies;
    },
    stallsVueFire() {
      return this.stallState;
    },
    ...mapGetters({ timeDifference: "getDurationFromNow", userOccupies: "getUserOccupiesStall", currentUser: "currentUser",  floorStalls: "getStallsByFloor", countFloor: "getCurrentFloor", stallState: "getStallWithState" }),
  },
  methods: {
    ...mapMutations(['set_current_gender']),
    ...mapActions(['onReportOccupiedAction','onReservationAction','onUnbookingAction','increaseFloor','decreaseFloor', "updateGender" ,"loginUser", 'onBookingAction', 'bindStalls', 'bindUsers']),
    accept() {
      if(this.index<6){
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
        // we could prob just update the state here/ the current floor
        this.increaseFloor();
        console.log('accessing getter for count floor: '+this.countFloor)
        this.index++
        this.isVisible = true
      }, 300)
      }
    },
    decline() {
      if(this.index>0){
      setTimeout(() => (this.isVisible = false), 200);
      setTimeout(() => {
        this.decreaseFloor();
        console.log('accessing getter for count floor: '+this.countFloor);
        this.index--;
        this.isVisible = true;
      }, 300);
      }
    },
    onGenderSwitch(value) {
      console.log('Visual update: Gender has switched to ' + value);
      this.updateGender(value);
      this.genderSelected = value;
    },
    onBooking(value){
      console.log('Database update: A booking has been made at stall: '+value+ ' now we send to firebase');
      this.onBookingAction(value);
    },
    onReportOccupied(value){
      this.onReportOccupiedAction(value);
    },
    onUnoccupy(){
      //run action to unbook the stall
      console.log('running onunoccupy command');
      this.onUnbookingAction();
    },
    onBookingReservation(data){
      var timestamp = data[0];
      var stallID = data[1];
      this.onReservationAction({'timestamp': timestamp, 'stallID': stallID})
      console.log('reservation for '+timestamp+ ' on stall ID: ' + stallID)
    },
    convertDurationToElapsed(stallNumber){
      let start = Date.now();
      let stallDuration = this.stallData[stallNumber].duration*1000; 
      const elapsed = start - stallDuration; 
      // final calculation of elapsed time since duration - current time
      const secondsElapsed = Math.floor(elapsed / 1000);
      console.log('fk1: ' +secondsElapsed+ ' seconds elapsed since  '+this.stallData[stallNumber]+ ' was occupied');
      return secondsElapsed;
    },
    //we need some type of method : 
    //method: whenever a user joins the app. we should check if any users are tied to an stall.
    //if they are tied to that stall, then we should place a variable "needsToCloseOut"
    //"needsToCloseOut = true" is going to display a full screen  with the timer + "unOccupy" the stall
  },
  watch: {
    index() {
      axios.get(`https://metrics-ooqigdh2aa-uc.a.run.app/count?floor=${this.index+1}&time=3`).then(response => (this.floorMetrics = response.data))
    },
      //this is only going to load the available data for the current front-end configuration
      //when a firebase collection change occurs..... unless we need to watch for changes in the fb collection to?
     // this.loadFloorData()
     displayNotification() {
       console.log('display message: '+this.displayMsg)
       console.log('should begin the recent notification if = true '+this.displayNotification)
       if(this.displayNotification == true){
         this.snackbar = true;
       } 
       else {
         this.snackbar = false;
       }
     }
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

.occupiedFixed {
    position: fixed;
    
    &--center {
    left: 50%;
    top: 37.5%;
    min-height: 500px;
    height: 280px;
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

.moveSnackbar{
  position: fixed;

}
</style>

