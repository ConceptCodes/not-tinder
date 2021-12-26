import Vue from 'vue'
import Vuex from 'vuex'
import { db, auth, currentTime } from '@/services/firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { DateTime } from "luxon";
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    stalls: [],
    currentFloor: 1,
    currentGender: 'f'
  },
  getters: {
      getStallsByFloor: (state) => (floorNumber, gender) => {
          return state.stalls.filter(stall => stall.floor === floorNumber && stall.gender === gender)
      },
      getStallWithState: (state) => {
        return state.stalls.filter(stall => stall.floor === state.currentFloor && stall.gender === state.currentGender)
      },
      getDurationFromNow: (state) => (stallID) => {
        var thisStall = state.stalls.find(o => o.id === stallID)
        var secondsinDateTime = DateTime.fromSeconds(thisStall.duration.seconds);
        var test = DateTime.now().diff(secondsinDateTime, ['hours', 'minutes', 'seconds']).toObject();
        console.log('the difference in time would be '+test);
        return test;
      },
      getCurrentFloor: (state) => {
        return state.currentFloor;
      },
      getCurrentGender: (state) => {
        return state.currentGender;
      },
      getUserOccupiesStall: (state) => {
        //first check if any stalls are occupied by the user- return true if so
        var anyStalls = state.stalls.filter(stall => stall.user === state.currentUser && stall.occupied);
        console.log('does the user occupy any stalls: ' + anyStalls)
        if(anyStalls.length > 0){
          console.log('user' + anyStalls[0].user +' occupies stall: '+ anyStalls[0].id)
          return true;
        } else {
          return false;
        }
      }
  },
  mutations: {
    SET_CURRENT_USER: (state, payload) => { state.currentUser = payload },
    SET_STALLS: (state, payload) => { state.stalls = payload },
    set_current_floor_increment: (state) => {state.currentFloor++},
    set_current_floor_decrement: (state) => {state.currentFloor--},
    set_current_gender: (state, payload) => { state.currentGender = payload; console.log('the current gender in vuex is: ' +state.currentGender)},
    BOOKING (state, payload) {
        console.log('Database update: A booking has been made at stall: '+payload+ ' now we send to firebase');
        console.log('the user who made the db update is: '+ state.currentUser)
        db.collection("stall_id").doc(payload).update({occupied: true, duration: currentTime, user: state.currentUser});
    },
    UNBOOKING (state, payload) {
      //find the stall that the user occupies?
      console.log(payload);
      var anyStalls = state.stalls.filter(stall => stall.user === state.currentUser && stall.occupied);
      db.collection("stall_id").doc(anyStalls[0].id).update({occupied: false, duration: currentTime, user: ''});
    },
    ...vuexfireMutations
  },
  actions: {
        bindStalls: firestoreAction(({ bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('stalls', db.collection('stall_id'))
        }),
      loginUser({commit}) {
        console.log('attempting to login')
        auth.signInAnonymously()
        .then(() => {
          auth.onAuthStateChanged((user) => {
            if (user) { commit('SET_CURRENT_USER', user.uid) } 
            else { commit('SET_CURRENT_USER', null) }
          });
        }).catch((error) => { console.error(error) });
      },
      increaseFloor(context) {
        context.commit('set_current_floor_increment')
      },
      decreaseFloor(context) {
        context.commit('set_current_floor_decrement')
      },
      updateGender(context, value) { context.commit('set_current_gender', value)},
      onBookingAction(context, value) {
        context.commit('BOOKING', value)
      },
      onUnbookingAction(context, value) {
        context.commit('UNBOOKING', value)
      }
    }
})

export default store;
