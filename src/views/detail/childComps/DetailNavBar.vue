<template>
    <nav-bar>
        <img slot="left" src="~assets/img/common/back.svg" alt="" class="back" @click="backClick">
        <div slot="center" class="title">
            <div class="title-item"
                 v-for="(item,index) in title"
                 @click="titleClick(index)"
                 :class="{active:currentIndex==index}">{{item}}</div>
        </div>
    </nav-bar>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    export default {
        name: "DetailNavBar",
        components:{
            NavBar
        },
        data(){
            return{
                title:['商品','参数','评论','推荐'],
                currentIndex:0
            }
        },
        methods:{
            titleClick(index){
                this.currentIndex=index;
                this.$emit('titleClick',index);
            },
            //返回首页
            backClick(){
                this.$router.back()
            }
        }
    }
</script>

<style scoped>
    .back {
        margin-top: 12px;
    }

    .title {
        display: flex;
        padding: 0 20px;
    }

    .title-item {
        flex: 1;
        font-size: 14px;
    }

    .title-item.active {
        color: var(--color-high-text)
    }
</style>