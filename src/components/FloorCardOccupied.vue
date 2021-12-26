<template>
  <v-card :class="colorOfCard"  class="mx-auto my-12 darken-2 white--text" max-width="600" id="floor-card">
    <v-card-title class="dark-orange">Ur taking a shit!</v-card-title>
    <v-card-text>
      <div class="white--text">You have occupied this stall for:</div>
    </v-card-text>
    <v-card-title text="center" style="margin-left: 20%; text-align: center;">Quality Rating</v-card-title>
    <v-card-text>
      <v-chip-group v-model="selection" active-class="black white--text" column style="margin-left: 20%; text-align: center;">
        <v-chip>Bad</v-chip>
        <v-chip>Ok</v-chip>
        <v-chip>Better</v-chip>
      </v-chip-group>
      <v-divider class="mx-2"></v-divider>
      <v-row>
        <v-btn style="margin-top: 35px; margin-left: 15px; width: 90%;"
          elevation="2" @click="unoccupyStall(stallID)"
        >Un-occupy the stall</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'floor-occupied-card',
    data: ()=> ({
        selection: 1,
        stallSelection: null,
        genderSelection: 0,
        isOrange: true,
        occupiedCheckOne: false,
        occupiedCheckTwo: false,
        colorOfCard: 'orange',
    }),
    props: {
        stallID: {
            type: String
        },
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
    },
    methods: {
      unoccupyStall(){
        console.log('running unoccupy stall')
          this.$emit('unoccupyStall');
        }
      ,
    },
}
</script>

<style>
.centerElem {
  left: 30%;
  position: fixed;
}
</style>
