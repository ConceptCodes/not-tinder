<template>
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
        <v-chip v-for="stall in stallData" :key="stall.id" :disabled="stall.occupied">Stall {{stall.id}}</v-chip>
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
        colorOfCard: 'orange',
    }),
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
      },
      stallData: function() {
        console.log('stall data is ---> ')
        this.stallData.forEach(element => {
          console.log(element.id);
          console.log(element.occupied);
        });
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
          alert('some data was not added: booking not available at this time.')
        }
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