<template>
  <v-card class="mx-auto my-12 orange darken-2 white--text" max-width="374" id="floor-card">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div class="white--text">Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-title>Availability</v-card-title>
    <v-card-text>
      <v-chip-group v-model="selection" active-class="black white--text" column>
        <v-chip>5:30PM</v-chip>
        <v-chip>7:30PM</v-chip>
        <v-chip>8:00PM</v-chip>
        <v-chip>9:00PM</v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'floor-card',
    data: ()=> ({
        selection: 1
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
    }
}
</script>

<style>

</style>