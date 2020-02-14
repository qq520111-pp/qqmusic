import Vue from 'vue'
import Vuex from 'vuex'
import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);
var Store = Vuex.Store

var store = new Store({
    state,
    mutations,
    getters,
    actions
})
export default store