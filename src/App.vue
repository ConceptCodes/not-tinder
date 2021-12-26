<template>
  <v-app>
    <v-main class="container">
      <div class="fixed fixed--center" style="z-index: 3" v-if="userOccupiesStall">
        <h2>This view would load if a user occupies a stall</h2>
        <Vue2InteractDraggable
          v-if="isVisible"
          :interact-x-threshold="100"
          @draggedRight="accept"
          @draggedLeft="decline"
          class="rounded-borders card"
        >
          <FloorCardOccupied @unoccupyStall="onUnoccupy"/>
        </Vue2InteractDraggable>
      </div>

      <div class="fixed fixed--center" style="z-index: 3" v-if="!userOccupiesStall">
        <Vue2InteractDraggable
          v-if="isVisible"
          :interact-x-threshold="100" 
          @draggedRight="accept"
          @draggedLeft="decline"
          class="rounded-borders card"
        >
          <FloorCard @clicked="onGenderSwitch" :floor_num="index"  @booking="onBooking" :title="current.text" :storeFloorStalls="stallsVueFire"/>
        </Vue2InteractDraggable>
      </div>
    <div
      v-if="next && !userOccupiesStall"
      class="rounded-borders card card--two fixed fixed--center"
      style="z-index: 2">
      <FloorCard :title="next.text" />
    </div>
    </v-main>
  </v-app>
</template>

<script>
import { Vue2InteractDraggable } from "vue2-interact";
import FloorCard from '@/components/FloorCard'
import { mapGetters, mapActions, mapMutations } from "vuex";
import FloorCardOccupied from '@/components/FloorCardOccupied'
export default {
  name: "app",
  components: { Vue2InteractDraggable, FloorCard, FloorCardOccupied },
  data() {
    return {
      isVisible: true,
      index: 0,
      user: null,
      selection: 1,
      genderSelected : 'b',
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
    this.loginUser();
    console.log('mounted  call of vuexstalldata = '+ this.vuexStallData)
    //this.loadFloorsInitally();
            //this.loadFloors();
    //should be able to pass this out right
  },
  created() {
    this.bindStalls();
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
    ...mapGetters({ timeDifference: "getDurationFromNow", userOccupies: "getUserOccupiesStall", currentUser: "currentUser",  floorStalls: "getStallsByFloor", countFloor: "getCurrentFloor", stallState: "getStallWithState" })
    
  },
  methods: {
    ...mapMutations(['set_current_gender']),
    ...mapActions(['onUnbookingAction','increaseFloor','decreaseFloor', "updateGender" ,"loginUser", 'onBookingAction', 'bindStalls']),
    accept() {
      if(this.index!=6){
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
      if(this.index!=0){
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
    onUnoccupy(){
      //run action to unbook the stall
      console.log('running onunoccupy command');
      this.onUnbookingAction();
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
.rounded-borders {
  border-radius: 12px;
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
