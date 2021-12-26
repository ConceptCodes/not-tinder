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
          <FloorOccupiedCard @clicked="onGenderSwitch" :floor_num="index" :stallID="userOccupiesStallID" @booking="onBooking"  @unoccupyStall="onUnoccupy"  :title="current.text"  :stallData="dataInView" :user="user"/>
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
          <FloorCard @clicked="onGenderSwitch" :floor_num="index"  @booking="onBooking" :title="current.text" :stallData="dataInView" :storeFloorStalls="stallsVueFire"/>
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
import FloorCard from '@/components/FloorCardStore'
import { db, currentTime, auth } from '@/services/firebase'
import FloorOccupiedCard from '@/components/FloorCardOccupied';
import { mapGetters, mapActions, mapMutations } from "vuex";
const firebaseData = db.collection("stall_id");
var unsubscribe;
export default {
  name: "app",
  components: { Vue2InteractDraggable, FloorCard, FloorOccupiedCard },
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
      ],
      items: [
        { title: 'Floor one' },
        { title: 'Floor two' },
        { title: 'Floor three' },
        { title: 'Floor four' },
        { title: 'Floor Five' },
      ],
      testFirebaseData: [],
      stallData: [],
      dataInView: [],
      vuexStallData : [],
      userOccupiesStall: false
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
    }),
    firebaseData.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.stallData.push({
          id: doc.id,
          occupied: doc.data().occupied,
          duration: doc.data().duration.seconds,
          user: doc.data().user
        });
      });
      console.log(this.stallData);
      this.loadFloorData();
    });
    unsubscribe = firebaseData.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'modified'){
          const updatedStall = this.stallData.find(
            stall => stall.id === change.doc.id
          );
          updatedStall.duration = change.doc.data().duration.seconds;
          updatedStall.occupied = change.doc.data().occupied;
          console.log("Stall was updated: ", updatedStall);
          console.log("timestamp was added "+change.doc.data().duration.seconds )
          this.loadFloorData();
        }
      })
    });
  },
  destroyed() {
    unsubscribe();
  },
  computed: {
    current() {
      return this.cards[this.index];
    },
    next() {
      return this.cards[this.index + 1]
    },
    stallsVueFire() {
      return this.stallState;
    },
    ...mapGetters({ currentUser: "currentUser",  floorStalls: "getStallsByFloor", countFloor: "getCurrentFloor", stallState: "getStallWithState" })
    
  },
  methods: {
    ...mapMutations(['set_current_gender']),
    ...mapActions(['increaseFloor','decreaseFloor', "updateGender" ,"loginUser", 'onBookingAction', 'bindStalls']),
    loadFloorsInitally() {
      db.collection("stall_id")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
           this.testFirebaseData.push({ ...doc.data() });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      },
    loginUser() {
    auth.signInAnonymously()
    .then(() => {
      auth.onAuthStateChanged((user) => {
        if (user) 
        { 
          console.log('user.uid ' +user.uid);
          this.user = user.uid;
        } 
        else { console.log('user '+user.uid) }
      });
    }).catch((error) => { console.error(error) });
    },
    accept() {
      if(this.index!=2){
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
        // we could prob just update the state here/ the current floor
        this.increaseFloor();
        console.log('accessing getter for count floor: '+this.countFloor)
        this.index++
        this.isVisible = true
        this.loadFloorData();
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
        this.loadFloorData();
      }, 300);
      }
    },
    onGenderSwitch(value) {
      console.log('Visual update: Gender has switched to ' + value);
      this.updateGender(value);
      this.genderSelected = value;
      this.loadFloorData();
    },
    onBooking(value){
      console.log('Database update: A booking has been made at stall: '+value+ ' now we send to firebase');
      this.onBookingAction(value);
    },
    onUnoccupy(stallID){
      var myTimestamp = currentTime;
      console.log('the stall thats unoccupied is '+stallID)
      db.collection("stall_id").doc(stallID).update({occupied: false, duration: myTimestamp, user: ''});
      this.loadFloorsInitally();
      this.userOccupiesStall = false;
      
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
    loadFloorData(){
      //index is == to the floor
      //genderSelected is == to the gender choice ('m' or 'f')
      //all data is stored in testFirebaseData
      var floorValue = this.index+1;
      var finalData = [];
      console.log('Summary update: the selected floor is '+ floorValue);
      console.log('Summary update: the selected gender is '+ this.genderSelected);
      for (let i =0; i < this.stallData.length; i++){
        //first check for floor
        //var userLength = String(this.stallData[i].user);
        //need to pass in the stall data, but lets just work on un-occupying the stall for now
        if(this.user == this.stallData[i].user){
          console.log('User '+ this.user+' attached to '+ this.stallData[i].id);
          this.userOccupiesStall = true;
          this.userOccupiesStallID = this.stallData[i].id;
        }
        if(this.stallData[i].id.charAt(0) == floorValue && this.stallData[i].id.charAt(1) == this.genderSelected){
            console.log('Summary update: found a stall that belongs in current view '+ this.stallData[i].id);
            var elapsedTime = this.convertDurationToElapsed(i);
            finalData.push({id:this.stallData[i].id, occupied: this.stallData[i].occupied, duration: elapsedTime});
        }
      }
      // all of the durations should be converted by this time
      this.dataInView = finalData;
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
