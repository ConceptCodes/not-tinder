<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        <h1>! Tinder</h1>
      </div>
    </v-app-bar>
    <v-main class="container">
    <div class="fixed fixed--center" style="z-index: 3">
      <Vue2InteractDraggable
        v-if="isVisible"
        :interact-x-threshold="200"
        @draggedRight="accept"
        @draggedLeft="decline"
        class="rounded-borders card card--one">
        <div class="flex flex--center" style="height: 100%">
          <h1>{{current.text}}</h1>
        </div>
      </Vue2InteractDraggable>
    </div>
    <div
      class="rounded-borders card card--two fixed fixed--center"
      style="z-index: 2">
      <div class="flex flex--center" style="height: 100%">
        <h1>test</h1>
      </div>
    </div>
    </v-main>
  </v-app>
</template>

<script>
import { Vue2InteractDraggable } from 'vue2-interact'

export default {
  name: 'app',
  components: { Vue2InteractDraggable },
  data() {
    return {
      isVisible: true,
      index: 0,
      cards: [
        { text: 'floor one' },
        { text: 'floor two' },
        { text: 'floor three' },
      ]
    }
  },
  computed: {
    current() {
      return this.cards[this.index]
    }
  },
  methods: {
    accept() {
      window.alert('accepted')
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
        this.index++
        this.isVisible = true
      }, 300)
    }, 
    decline() {
      window.alert('declined')
      setTimeout(() => this.isVisible = false, 200)
      setTimeout(() => {
        this.index++
        this.isVisible = true
      }, 300)
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
    top: 50%;
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
  &--one {
    background-color: orange;
  }
  &--two {
    background-color: red;
    width: 280px;
    top: 51%;
  }
  &--three {
    background-color: orange;
    width: 260px;
    top: 51.8%;
  }
}
</style>