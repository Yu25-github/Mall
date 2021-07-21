<template>
    <div class="cart-list">
        <scroll  class="content" ref="scroll">
            <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>
        </scroll>
    </div>
</template>

<script>
    import CartListItem from "./CartListItem";
    import Scroll from "components/common/scroll/Scroll";

    export default {
        name: "CartList",
        components: {Scroll, CartListItem},
        props:{
            cartList:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        activated() {
            //解决不能滚动问题
            this.$refs.scroll.refresh()
        }


    }
</script>

<style scoped>
    /*滑不动*/
    /*.cart-list {*/
    /*    height:calc(100% - 44px - 49px);*/

    /*}*/
    /*.content{*/
    /*    height: 100%;*/
    /*    overflow: hidden;*/
    /*}*/
    .cart-list{
        height: 100vh;
        position: relative;
    }
    .content{
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
        overflow: hidden;
    }
</style>