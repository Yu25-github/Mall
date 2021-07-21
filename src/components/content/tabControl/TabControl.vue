<template>
    <div class="tab-control">
        <div v-for="(item,index) in titles"
             :class="{active:index===currentIndex}"
             @click="tabClick(index)"
             class="tab-control-item">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabControl",
        props:{
            titles:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return{
                currentIndex:0
            }
        },
        methods:{
            tabClick(index){
                this.currentIndex=index;
                this.$emit('tabClick',index)
            }
        }

    }
</script>

<style scoped>
    .tab-control{
        display: flex;
        text-align: center;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
    }
    .tab-control-item{
        flex: 1;
    }
    .tab-control-item span{
        padding: 5px;
    }
    .active{
        color: hotpink;
    }
    .active span{
        border-bottom: 3px solid hotpink;
    }

</style>