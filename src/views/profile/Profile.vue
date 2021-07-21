<template>
    <div>
        <scroll class="content" >
        <ul v-for="(item,index) in 100">
            <li>{{index}}</li>

        </ul>
        </scroll>
    </div>

</template>

<script>
    import Scroll from "components/common/scroll/Scroll";
    export default {
        name: "Profile",
        components:{
            Scroll
        }
    }
</script>

<style scoped>
    .content{
        height: 300px;
        background-color: red;
        overflow: hidden;
    }

</style>
