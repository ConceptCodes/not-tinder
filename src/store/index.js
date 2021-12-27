import Vue from 'vue'
import Vuex from 'vuex'
import { db, auth, currentTime } from '@/services/firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { DateTime, } from "luxon";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
Vue.use(Vuex)


/**
 * 
 * @param {Array} reservations an array of reservation objects 
 * @param {DateTime} suggestedTime the datetime that will be compared for a conflict
 * @returns True if there is a time conflict, false if there isn't
 */
function checkIfTimeConflict(reservations, suggestedTime) {
  if(!reservations?.length){
    //there are no reservations
    return false;
  }
  else {
    //loop thru every reservation to find suggestable times
    for(let r in reservations){
      console.log(reservations[r])
      var reservationTime = DateTime.fromSeconds(reservations[r].time.seconds);
      if(reservationTime < suggestedTime) {
        //diff = the milliseconds from reservation time to suggested
        var diff = suggestedTime.diff(reservationTime, ['hours','minutes']).toObject(); 
        console.log(diff);
        if(diff.hours== 0 && diff.minutes <= 30){
          //the reservation time is within 30 minutes from each other. 
          console.log('r u crashing here')
          return true;
        }
        //else- there is no conflict from reservation to suggested
      }
      else if(reservationTime > suggestedTime) {
        //the milliseconds from reservation time to suggested
        var diff2 = reservationTime.diff(suggestedTime, ['hours','minutes']).toObject(); 
        if(diff2.hours== 0 && diff2.minutes <= 30){
          console.log('r u crashing here')
          //the reservation time is within 30 minutes from each other. 
          return true;
        }
          //else- there is no conflict from reservation to suggested
      }
      else {
        //suggested time = to reservation time/ not good
        return true;
      }
    }
  }
  //made it thru the loop w.o any trues being thrown
  return false;
}

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
      },
      //get stall has reservation 
      //the reserve ahead feature is attached to the specific stall (that is selected)
      //therefore, computed properties should load the 3 reserve ahead suggestions. (maybe random at the :15 :30 :45 or top of hour)
      //lastly a time picker can be used. 
      getReservationsForStall: (state) => (stallID) => {
        //this should return suggested reservation times
        var thisStall = state.stalls.filter(stall => stall.id === stallID);
        console.log(thisStall);
        var suggestedReservationTimes = [];
        //loop thru 3 times, and find a reservation time for each
        for (var i =0; i<3; i++){
          console.log('suggested reserve times: ')
          console.log(suggestedReservationTimes);
          var hour = 1+i;
          //it'll either be 1,2,3,4 - so 
          var randomSelection = Math.floor(Math.random() * (4 - 1 + 1) + 1);

          if(randomSelection == 1) {
            var sugTime = DateTime.now().plus({hours: hour, minutes: 1})
            var timeUntil = sugTime.diff(DateTime.now(), ['hour', 'minute']).toObject();
            if(!checkIfTimeConflict(thisStall[0].reservation, sugTime)){
              suggestedReservationTimes.push({'timestamp': sugTime.toMillis(),'time': {'hour': timeUntil.hours.toFixed(), 'minute': timeUntil.minutes.toFixed()}, 'available': true});
            }
            else {
              suggestedReservationTimes.push({'time': {'hour': timeUntil.hours.toFixed(), 'minute': timeUntil.minutes.toFixed()}, 'available': false});
            }
          }
          if(randomSelection == 2) {
            var sugTime2 = DateTime.now().plus({hours: hour, minutes: 15})
            var timeUntil2 = sugTime2.diff(DateTime.now(), ['hour', 'minute']).toObject();
            if(!checkIfTimeConflict(thisStall[0].reservation, sugTime2)){
              suggestedReservationTimes.push({'timestamp': sugTime2.toMillis(),'time': {'hour': timeUntil2.hours.toFixed(), 'minute': timeUntil2.minutes.toFixed()}, 'available': true});
            }
            else {
              suggestedReservationTimes.push({'time': {'hour': timeUntil2.hours.toFixed(), 'minute': timeUntil2.minutes.toFixed()}, 'available': false});
            }
          }
          if(randomSelection == 3) {
            var sugTime3 = DateTime.now().plus({hours: hour, minutes: 30})
            var timeUntil3 = sugTime3.diff(DateTime.now(), ['hour', 'minute']).toObject();
            if(!checkIfTimeConflict(thisStall[0].reservation, sugTime3)){
              suggestedReservationTimes.push({'timestamp': sugTime3.toMillis(), 'time': {'hour': timeUntil3.hours.toFixed(), 'minute': timeUntil3.minutes.toFixed()}, 'available': true});
            }
            else {
              suggestedReservationTimes.push({'time': {'hour': timeUntil3.hours.toFixed(), 'minute': timeUntil3.minutes.toFixed()}, 'available': false});
            }
          }
          if(randomSelection == 4) {
            var sugTime4 = DateTime.now().plus({hours: hour, minutes: 45})
            var timeUntil4 = sugTime4.diff(DateTime.now(), ['hours', 'minutes']).toObject();
            if(!checkIfTimeConflict(thisStall[0].reservation, sugTime4)){
              suggestedReservationTimes.push({'timestamp': sugTime4.toMillis(),'time': {'hour': timeUntil4.hours.toFixed(), 'minute': timeUntil4.minutes.toFixed()}, 'available': true});
            }
            else {
              suggestedReservationTimes.push({'time': {'hour': timeUntil4.hours.toFixed(), 'minute': timeUntil4.minutes.toFixed()}, 'available': false});
            }
          }
          else if(randomSelection > 4 || randomSelection < 1) {
            console.log('the randomSelection produced a number outside of bounds '+ randomSelection)
          }
        }
        console.log('the suggested reservation times are: ');
        console.log(suggestedReservationTimes);
        return suggestedReservationTimes;
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
    //payload should be a timestamp for the reservation slot
    RESERVATION_BOOKING (state, payload) {
      var anyStalls = state.stalls.filter(stall => stall.id === payload.stallID);
      var firebaseTimestamp = new Date(payload.timestamp);
      db.collection("stall_id").doc(anyStalls[0].id).update({reservation: firebase.firestore.FieldValue.arrayUnion({time: firebaseTimestamp, user: state.currentUser})});
    },
    //needs a set reservation button. that will add the timestamp to the reservation array. 
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
    stalls: []
  },
  getters: {
    currentUser: state => state.currentUser
  },
  mutations: {
    SET_CURRENT_USER: (state, payload) => { state.currentUser = payload },
    SET_STALLS: (state, payload) => { state.stalls = payload }
  },
  actions: {
      loadAllStalls({commit}) {
        let tmp = []
        db.collection("stall_id")
        .get()
        .then((qs) => { qs.forEach((doc) => { tmp.push({ ...doc.data() }) }) })
        .catch((error) => { console.log("Error getting documents: ", error); });
        commit('SET_STALLS', tmp)
      },
      loginUser({commit}) {
        auth.signInAnonymously()
        .then(() => {
          auth.onAuthStateChanged((user) => {
            if (user) { commit('SET_CURRENT_USER', user.multifactor.user) } 
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
      },
      onReservationAction(context, value) {
        context.commit('RESERVATION_BOOKING', value)
      }
    }
})

      bookRestroom(value) {
        console.log('Database update: A booking has been made at stall: '+value+ ' now we send to firebase');
        db.collection("stall_id").doc(value).update({occupied: true});
      }
  }
})

export default store;

