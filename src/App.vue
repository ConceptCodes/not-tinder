<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        <h1>Insider Stall Test123</h1>
      </div>
    </v-app-bar>
    <v-main class="container">
      <div class="fixed fixed--center" style="z-index: 3">
    <v-menu transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on, attrs }" style="z-index: 1; width: 90%;">
          <v-btn  class="purple rounded-borders card" color="primary" dark v-bind="attrs" v-on="on" 
          style="z-index: 1; height: 35px; width: 85%">
            {{current.text}}
          </v-btn>
          <v-btn color="red" fab small dark style="left: 9px">
            <v-icon>mdi-bell-ring</v-icon>
          </v-btn>
      </template>
      <v-list>
        <v-list-item 
          v-for="(item, i) in items"
          :key="i">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
        <Vue2InteractDraggable
          v-if="isVisible"
          :interact-x-threshold="100"
          @draggedRight="accept"
          @draggedLeft="decline"
          class="rounded-borders card"
        >
          <FloorCard @clicked="onGenderSwitch" @booking="onBooking" :title="current.text" :stallData="dataInView"/>
        </Vue2InteractDraggable>
      </div>
    <div
      v-if="next"
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
import { db } from '@/services/firebase'

const firebaseData = db.collection("stall_id");
var unsubscribe;

export default {
  name: "app",
  components: { Vue2InteractDraggable, FloorCard },
  data() {
    return {
      isVisible: true,
      index: 0,
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
      dataInView: []
    };
  },
  mounted() {
    //this.loadFloorsInitally();
            //this.loadFloors();
    //should be able to pass this out right
  },
  created() {
    firebaseData.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.stallData.push({
          id: doc.id,
          occupied: doc.data().occupied,
          duration: doc.data().duration
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
          updatedStall.occupied = change.doc.data().occupied;
          console.log("Stall was updated: ", updatedStall);
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
    }
  },
  methods: {
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
    accept() {
      if(this.index!=2){
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
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
        this.index--;
        this.isVisible = true;
        this.loadFloorData();
      }, 300);
      }
    },
    onGenderSwitch(value) {
      console.log('Visual update: Gender has switched to ' + value)
      this.genderSelected = value;
      this.loadFloorData();
    },
    onBooking(value){
      console.log('Database update: A booking has been made at stall: '+value+ ' now we send to firebase');
      db.collection("stall_id").doc(value).update({occupied: true});
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
        if(this.stallData[i].id.charAt(0) == floorValue && this.stallData[i].id.charAt(1) == this.genderSelected){
            console.log('Summary update: found a stall that belongs in current view '+ this.stallData[i].id);
            finalData.push(this.stallData[i]);
        }
      }
      this.dataInView = finalData;
    }
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
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.rounded-borders {
  border-radius: 12px;
}
.card {
  width: 300px;
  height: 300px;
  color: white;
  &--two {
    width: 280px;
    top: 49%;
  }
  &--three {
    width: 260px;
    top: 40%;
  }
}
</style>