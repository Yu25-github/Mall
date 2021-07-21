<template>
    <div>
        <swiper>
            <swiper-item v-for="item in banners">
                <a :href="item.link">
                    <img :src="item.image" alt="" @load="imageLoad"><!--监听-->
                </a>
            </swiper-item>
        </swiper>
    </div>

</template>

<script>
    import {Swiper,SwiperItem} from 'components/common/swiper'
    export default {
        name: "HomeSwiper",
        components:{
            Swiper,
            SwiperItem
        },
        props:{
            banners:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return{
                isLoaded:false
            }
        },
        methods:{
            imageLoad(){
                if(!this.isLoaded){
                    this.$emit('swiperImageLoaded')
                    this.isLoaded=true
                }
            }
        }

    }
</script>

<style scoped>
    /*img{*/
    /*    height: 200px;*/
    /*}*/

</style>