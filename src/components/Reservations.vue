<template>
  <v-card  style="z-index: 3" :class="colorOfCard"  class="mx-auto fixed fixed--center card  my-12 darken-2 white--text" max-width="600" id="floor-card">
    <v-list subheader>
      <v-subheader>Your Reservations</v-subheader>

      <v-list-item
        v-for="res in reservations"
        :key="res.id"
      >

        <v-list-item-content>
          <v-list-item-title v-text="res.stallID"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title v-text="res.date"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title v-text="res.time"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>
           mdi-close
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>



    <v-card-title text="center" style="margin-left: 20%; margin-top: 52%; text-align: center;"></v-card-title>
    <v-card-text>
      <v-chip-group v-model="selection" active-class="black white--text" column style="margin-left: 20%; text-align: center;">
      </v-chip-group>
      <v-divider class="mx-2"></v-divider>
      <v-row>
        <v-btn style="margin-top: 35px; margin-left: 15px; width: 90%;"
        >Back to Home Page</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'reservations',
    data: () => ({
      colorOfCard: 'teal',
      isOrange: true,
      selection: 1
    }),
    created() {
    },
    computed: {
      reservations() {
      console.log(this.userReservation)
      return this.userReservation;
    },
      ...mapGetters({ userReservation: "getReservations" })
    },
    methods: {
      luxonCalculate(time) {
        return this.$luxon(time, "dd-MM-yyyy")
      }
    }
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

