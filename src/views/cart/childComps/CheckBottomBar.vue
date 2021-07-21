<template>
    <div class="bottom-bar">

            <check-button class="select-all"
                          @click.native="checkBtnClick"
                          :is-checked="isSelectAll"/><!--是否全选-->
            <span>全选</span>
            <span class="total-price">合计：￥{{totalPrice}}</span>
            <span class="buy-product" @click="calcClick"> 去计算{{checkLength}}</span>


    </div>


</template>

<script>
    import CheckButton from "./CheckButton";
    import {mapGetters} from 'vuex';

    export default {
        name: "CheckBottomBar",
        components:{
            CheckButton
        },
        data(){
            return{
                count:0
            }
        },
        computed:{
            ...mapGetters([
                'cartList',
            ]),
            isSelectAll(){
                if(this.cartList.length===0) return false//没有数据时为空，不选中
                return !this.cartList.find(item=>!item.checked)
            },
            totalPrice(){
                const cartList=this.cartList;
                return cartList.filter(item=>{
                    return item.checked
                }).reduce((preValue,item)=>{
                    return preValue+item.count*item.price
                },0).toFixed(2)
            },
            checkLength(){
                return this.$store.state.cartList.filter(item=>item.checked).length
            }
        },
        methods:{
            checkBtnClick(){
                //判断是否有未选中的按钮
                // let isSelectAll=this.$store.getters.cartList.find(item=>!item.checked)
                let isSelectAll=this.cartList.find(item=>!item.checked)
                //有为选中的内容，则全部选中
                if(isSelectAll){
                    this.cartList.forEach(item=>{
                        item.checked=true;
                    });
                }else{
                    this.cartList.forEach(item=>{
                        item.checked=false;
                    });
                }
            },
            calcClick(){
                if(!this.isSelectAll){
                    this.$toast.show('请选择购买的商品',2000)
                }
            }
        }
    }
</script>

<style scoped>
    .bottom-bar {
        width: 100%;
        height: 44px;
        background-color: #eee;
        position: fixed;
        bottom: 49px;
        left: 0;
        box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
        font-size: 14px;
        color: #888;
        line-height: 44px;
        padding-left: 35px;
        box-sizing: border-box;
    }


    .bottom-bar .select-all {
        position: absolute;
        line-height: 0;
        left: 12px;
        top: 13px;
    }

    .bottom-bar .total-price {
        margin-left: 15px;
        font-size: 16px;
        color: #666;
    }

    .bottom-bar .buy-product {
        background-color: orangered;
        color: #fff;
        width: 100px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        float: right;
    }
</style>