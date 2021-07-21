import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations:{
        //mutations唯一的目的就是修改state中的状态
        addCounter(state,payload){
            payload.count++
        },
        addToCart(state,payload){
            payload.checked=false
            state.cartList.push(payload)
        }

    },
    actions:{
        addCart(context,payload){
            // //payload新添加的商品
            // let oldProduct=null;
            // for(let item of context.state.cartList){
            //     if(item.iid===payload.iid){
            //         oldProduct=item;
            //     }
            // }
            // //判断oldProduct
            // if(oldProduct){
            //     context.commit('addCounter',oldProduct)
            // }else{
            //     payload.count=1;
            //     context.commit('addToCart',payload)
            // }
            return new Promise((resolve,reject)=>{
                let oldProduct=null;
                for(let item of context.state.cartList){
                    if(item.iid===payload.iid){
                        oldProduct=item;
                    }
                }
                //判断oldProduct
                if(oldProduct){
                    context.commit('addCounter',oldProduct)
                    resolve('当前的商品数量+1')
                }else{
                    payload.count=1;
                    context.commit('addToCart',payload)
                    resolve('添加了新的商品')
                }
            })
        }
    },
    getters:{
        cartLength(state){
            return state.cartList.length
        },
        cartList(state){
            return state.cartList
        }
    }


})
 export default store