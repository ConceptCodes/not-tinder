<template>
  <v-card :class="colorOfCard" style="z-index: 3" class="mx-auto my-12 darken-2 white--text" max-width="600" id="floor-card">
    <v-card-title class="dark-orange">Ur viewing this message because:</v-card-title>
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
    top: 15%;
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
.hoverIcon:hover {
  background-color: red;
}
.rounded-borders {
  border-radius: 12px;
}

.menu-rounded-borders {
  border-radius: (12px, 12px, 12px, 0px);
}
.card {
  width: 300px;
  height: 450px;
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
