<template >
  <v-card if="latestActivity" style="z-index: 3" :class="colorOfCard"  class="mx-auto fixed fixed--center card  my-12 darken-2 white--text" max-width="600" id="floor-card">
    <v-list subheader>
      <v-subheader style="color: white; font-size: 15px; font-weight: 800; background-color: teal; align-items: center; justify-content: center; text-align: center;">Latest Activity</v-subheader>

      <v-list-item
        v-for="res in latestActivity"
        :key="res.id"
      >
        <v-list-item-content>
          <v-list-item-title v-text="'ID: '+res.stallID"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title v-text="res.oldStatus"></v-list-item-title>
        </v-list-item-content>
                <v-list-item-content>
          <v-list-item-title v-text="' -> '"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title v-text="res.newStatus"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>



    <v-card-title text="center" style="margin-left: 20%; margin-top: 28%; text-align: center;"></v-card-title>
    <v-card-text>
      <v-chip-group v-model="selection" active-class="black white--text" column style="margin-left: 20%; text-align: center;">
      </v-chip-group>
      <v-divider class="mx-2"></v-divider>
      <v-row>
        <v-btn style="margin-top: 35px; margin-left: 15px; width: 90%;" @click="checkActivity()"
        >Back to Home Page</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'recent-activity',
    data: () => ({
      colorOfCard: 'teal',
      isOrange: true,
      selection: 1
    }),
    created() {
    },
    computed: {
      latestActivity() {
      return this.latestActivity;
    },
      ...mapGetters({ latestActivity: "latestActivity" })
    },
    methods: {
      luxonCalculate(time) {
        return this.$luxon(time, "dd-MM-yyyy")
      },
      checkActivity(){
          console.log(this.latestActivity);
      },
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

