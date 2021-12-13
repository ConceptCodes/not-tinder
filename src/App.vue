<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        <h1>Insider Stall Tinder</h1>
      </div>
    </v-app-bar>
    <v-main class="container">
      <div class="fixed fixed--center" style="z-index: 3">
        <Vue2InteractDraggable
          v-if="isVisible"
          :interact-x-threshold="200"
          @draggedRight="accept"
          @draggedLeft="decline"
          class="rounded-borders card"
        >
          <FloorCard :title="current.text" />
        </Vue2InteractDraggable>
      </div>
    <div
      v-if="next"
      class="rounded-borders card card--two fixed fixed--center"
      style="z-index: 2">
      <FloorCard :title="next.text" />
    </div>
    <h1 class="fixed fixed--center">No more floors :(</h1>
    </v-main>
  </v-app>
</template>

<script>
import { Vue2InteractDraggable } from "vue2-interact";
import FloorCard from '@/components/FloorCard'
import { db } from '@/services/firebase'

export default {
  name: "app",
  components: { Vue2InteractDraggable, FloorCard },
  data() {
    return {
      isVisible: true,
      index: 0,
      selection: 1,
      cards: []
    };
  },
  mounted() {
    this.loadFloors()
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
    loadFloors() {
      db.collection("floors")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
           this.cards.push({ ...doc.data() });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    accept() {
      window.alert("accepted");
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
        this.index++
        this.isVisible = true
      }, 300)
    },
    decline() {
      window.alert("declined");
      setTimeout(() => (this.isVisible = false), 200);
      setTimeout(() => {
        this.index++;
        this.isVisible = true;
      }, 300);
    },
  },
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
    top: 51%;
  }
  &--three {
    width: 260px;
    top: 51.8%;
  }
}
</style>