<template v-if="stallData">
  <v-card :class="colorOfCard"  class="mx-auto my-12 darken-2 white--text" max-width="600" id="floor-card">
    <v-card-title class="dark-orange">{{title}}</v-card-title>
    <v-card-text>
      <div class="white--text">Floor one has reports of little foot traffic, and an average usage time of 2 minutes. Expect longer wait times between 8am-9:30am and 4pm-5:30pm.</div>
    </v-card-text>
    <v-chip-group v-model="genderSelection" active-class="black white--text" column>
        <v-chip style="margin-left: 25%;">Male</v-chip>
        <v-chip >Female</v-chip>
      </v-chip-group>
    <v-divider class="mx-4"></v-divider>
        <v-card-title text="center" v-if="genderSelection==0">Men's Room</v-card-title>
        <v-card-title text="center" v-if="genderSelection==1">Female's Room</v-card-title>
    <v-card-text>
      <v-chip-group v-model="stallSelection" style="margin-left: 17%;" column active-class="green white--text">
        <v-chip v-for="stall in stallData" :key="stall.id" :disabled="stall.occupied">{{stall.occupied ? 'occupied for:'+ stall.duration: stall.id}}</v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-title text="center">Reserve Ahead</v-card-title>
    <v-card-text>
      <v-chip-group v-model="selection" active-class="black white--text" column>
        <v-chip>5:30PM</v-chip>
        <v-chip>7:30PM</v-chip>
        <v-chip>8:00PM</v-chip>
      </v-chip-group>
      <v-divider class="mx-2"></v-divider>
      <v-row>
                      <v-btn style="margin-top: 35px; width: 45%;"
          elevation="2" @click="bookStall(stallSelection, genderSelection, floor_num)"
        >Book Now</v-btn>
                <v-btn style=" margin-top: 35px; width: 45%; margin-left: 10%;" 
          elevation="2"
        >Reserve</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'floor-card',
    data: ()=> ({
        selection: 1,
        stallSelection: null,
        genderSelection: 0,
        isOrange: true,
        timerOne: null,
        timerOneRunning: false,
        timeOne: 0,
        timerTwo: null,
        timerTwoRunning: false,
        timeTwo: 0,
        occupiedCheckOne: false,
        occupiedCheckTwo: false,
        colorOfCard: 'orange',
    }),
    created() {
      this.timerOneRunning == false;
      clearInterval(this.timerOne);
      this.timerTwoRunning == false;
      clearInterval(this.timerTwo);
      console.log('did this even run yet')
      this.timerOne = null;
      this.timerTwo = null;
      this.timeOne = 0;
      this.timeTwo = 0;
        for(var stall in this.stallData) {
          console.log('example stall: '+this.stallData[stall].duration);
          // if one of the stalls are occupied
          if(this.stallData[stall].occupied){
            console.log('warning atleast 1 stall is occupied')
            console.log(stall);
            if(stall == 0){
              //its occupied, so lets attach a timer to this stall
              console.log('warning stall 0 is occupied- starting a timer');
              //stall 1 is occupied, so begin the timer from the elapsed seconds + counting
              this.toggleTimer(0);
            }
            if(stall == 1){
              console.log('warning stall 0 is occupied- starting a timer');
              this.toggleTimer(1);
            }
          }
          else if(!this.stallData[stall].occupied){
              console.log('Stall '+ this.stallData[stall].id + ' is available!')
          }
        }
    },
    props: {
        floor_num: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: 'Floor Name'
        },
        stallData: {
          type: Array,
        }
    },
    watch: {
      genderSelection: function() {
        if(this.genderSelection == 0){
          this.colorOfCard = 'orange';
          this.$emit('clicked', 'b');
        }
        else if (this.genderSelection == 1){
          this.colorOfCard = 'teal';
          this.$emit('clicked', 'f')
        }
      },
      stallSelection: function() {
        console.log(this.stallSelection);
        this.checkForDisabled();
      }
    },
    methods: {
      bookStall(stallNum, gender, floor){
        if(stallNum!=null && gender!=null && floor!=null){
          console.log('stall has been booked');
          var id = '';
          //create the id to compare w. firebase data
          if(gender == 0){ //gender=0 is a male
            id = String([floor+1, 'b', stallNum+1])
            id = id.replace(/[, ]+/g, "").trim();
          }
          if(gender ==1){ //gender=1 is a female
            id = String([floor+1, 'f', stallNum+1])
            id = id.replace(/[, ]+/g, "").trim();
          }
          this.$emit('booking', id)
        }
        else {
          alert('Error: some data was not added, therefore booking not available at this time.')
        }
      },
      checkForDisabled() {
        for(var stall in this.stallData) {
          if(this.stallData[stall].occupied){
              console.log('Stall '+ this.stallData[stall].id + ' has been occupied for: '+ this.stallData[stall].duration);

          }
          else if(!this.stallData[stall].occupied){
              console.log('Stall '+ this.stallData[stall].id + ' has not been occupied for')
          }
        }
      },
      toggleTimer(stallIndex) {
        console.log('timer started')
        //var elapsedTime = this.stallData[stallIndex].duration;
        if (this.timerOneRunning && stallIndex == 0) {
          this.timerOneRunning == false;
          clearInterval(this.timerOne);
        }
        else if (!this.timerOneRunning && stallIndex == 0){
          this.timerOneRunning == true;
          this.timerOne = setInterval(this.incrementTimeZero, 1000);
        }
        else if (this.timerTwoRunning && stallIndex == 1){
          this.timerTwoRunning == false;
          clearInterval(this.timerTwo);
        }
        else if(!this.timerTwoRunning && stallIndex == 1){
          this.timerTwoRunning == true;
           this.timerTwo = setInterval(this.incrementTimeOne, 1000)
        }
      },
      incrementTimeZero() {
        this.stallData[0].duration =this.stallData[0].duration+1;
      },
      incrementTimeOne() {
        this.stallData[1].duration =this.stallData[1].duration+1;
      }
    },
}
</script>

<style>
.centerElem {
  left: 30%;
  position: fixed;
}
</style>