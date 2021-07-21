<template>
    <div>
        <nav-bar class="nav-bar">
            <div slot="center">购物车（{{cartLength}}）</div>
        </nav-bar>
        <cart-list :cart-list="cartList"></cart-list>
        <check-bottom-bar></check-bottom-bar>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import CartList from "./childComps/CartList";
    import CheckBottomBar from "./childComps/CheckBottomBar";

    import {mapGetters} from 'vuex'

    export default {
        name: "Cart",
        components:{
            NavBar,
            CartList,
            CheckBottomBar
        },
        // data(){
        //     return{
        //         cartItem:0,
        //         cartList: {}
        //     }
        // },
        computed:{
            // cartLength(){
            //     this.cartItem=this.$store.state.cartList.length;
            //     this.cartList=this.$store.state.cartList;
            // }
            //直接在vuex中的getter把相关的属性计算出来，作为一个统一的数据在后面的开发中直接使用，不用
            //再通过$store.state去取数据
            ...mapGetters([
                'cartLength',
                'cartList'
            ])

        },

    }
</script>

<style scoped>
    .nav-bar {
        background-color: var(--color-tint);
        color: #fff;
        font-weight: 700;
    }
</style>
