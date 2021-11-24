import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 0,
        token: "",
        user: {},
        sessionId: ""
    },

    /**
     * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
     * store.commit('increment')
     */
    mutations: {
        increment(state) {
            state.count++
        },
        setsessionId(state, newsessionId) {
            state.sessionId = newsessionId;
        },
        settoken(state, newtoken) {
            state.token = newtoken;
        },
        setuser(state, newuser) {
            state.user = { ...state.user, ...newuser }
        }
    },
    /**
     * 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
     */
    getters: {
        getsessionId(state) {
            return state.sessionId;
        },
        gettoken(state) {
            return state.token;
        },
        getuser(state) {
            return state.user
        },
    },
    /**
     * Action 提交的是 mutation，而不是直接变更状态。
     * Action 可以包含任意异步操作。
     */
    actions: {}
})
export default store