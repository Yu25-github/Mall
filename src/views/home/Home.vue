<template>

    <div id="home">
        <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
        <tab-control :titles="['流行','新款','精选']"
                     class="tab-control"
                     @tabClick="tabClick"
                     ref="topTab" v-show="isTabFixed"></tab-control>
        <scroll class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore">
            <home-swiper :banners="banners" @swiperImageLoaded="swiperImageLoaded" />
            <recommend-view :recommends="recommends"/>
            <feature-view></feature-view>
            <tab-control :titles="['流行','新款','精选']"
                         class="tab-control"
                         @tabClick="tabClick"
                         ref="tabControl" ></tab-control>
            <goods-list :goods="showGoods"></goods-list>
        </scroll>
        <backtop @click.native="backClick" v-show="isShowBackTop"/>

    </div>
</template>

<script>

    import HomeSwiper from "./childComps/HomeSwiper";
    import RecommendView from "./childComps/RecommendView";
    import FeatureView from "./childComps/FeatureView";

    import NavBar from "components/common/navbar/NavBar";
    import Scroll from "components/common/scroll/Scroll";
    import Backtop from "components/common/backtop/Backtop";
    import TabControl from "components/content/tabControl/TabControl";
    import GoodsList from "components/content/goods/GoodsList";



    import {getMultiData,getProductData} from "network/home";
    import {debounce} from 'common/utils';



    export default {
        name: "Home",
        components:{
            HomeSwiper,
            RecommendView,
            FeatureView,
            NavBar,
            TabControl,
            GoodsList,
            Scroll,
            Backtop

        },
        data(){
          return{
              banners:[],
              recommends:[],
              goods:{
                  'pop':{page:1, list:[]},
                  'new':{page:1, list:[]},
                  'sell':{page:1, list:[]},
              },
              currentType:'pop',
              isShowBackTop:false,
              tabOffsetTop:0,
              isTabFixed:false,
              saveY:0,
              itemImgListener:null
          }
        },
        computed:{
           showGoods(){
               return this.goods[this.currentType].list
           }
        },
        created() {
            //1.请求多个数据
            this._getMultiData()
            //2.请求商品数据
            this._getProductData('pop')
            this._getProductData('new')
            this._getProductData('sell')


        },
        mounted() {
            //3.监听一些事件
            const refresh=debounce(this.$refs.scroll.refresh,200)
            this.itemImgListener=()=> {
                refresh()
            }
            this.$bus.$on('imgLoad',this.itemImgListener)
        },
        activated() {
            this.$refs.scroll.refresh()
            this.$refs.scroll.scrollTo(0,this.saveY,2)
        },
        deactivated() {
            //保存Y值
            this.saveY=this.$refs.scroll.getScrollY()
            //取消全局事件的监听
            this.$bus.$off('imgLoad',this.itemImgListener)
        },
        methods:{
            _getMultiData(){
                getMultiData().then(res=>{
                    // console.log(res);
                    this.banners=res.data.banner.list;
                    this.recommends=res.data.recommend.list;
                })
            },
            _getProductData(type) {
                // 获取页码
                const page = this.goods[type].page
                getProductData(type, page).then(res => {
                    const newList = res.data.list
                    this.goods[type].list.push(...newList)
                    this.goods[type].page += 1
                    //加载更多的数据
                    this.$refs.scroll.finishPullUp()
                })
            },
            tabClick(index){
                switch (index) {
                    case 0:
                        this.currentType='pop'
                        break
                    case 1:
                        this.currentType='new'
                        break
                    case 2:
                        this.currentType='sell'
                        break

                }
                this.$refs.tabControl.currentIndex=index
                this.$refs.topTab.currentIndex=index
            },
            backClick(){
                this.$refs.scroll.scrollTo(0,0)
                // console.log('hghg');
            },
            contentScroll(position){
                // console.log(position);
                //1.判断BackTop是否显示
                this.isShowBackTop=(-position.y)>1000
                //2.决定tabControl是否吸顶（position:fixed)
                this.isTabFixed=(-position.y)>this.tabOffsetTop
            },
            loadMore(){
                this._getProductData(this.currentType)
                // this.$refs.scroll.scroll.refresh()
            },
            swiperImageLoaded(){

                this.tabOffsetTop=this.$refs.tabControl.$el.offsetTop;
                // console.log(this.$refs.tabControl.$el.offsetTop);
            }


        },

    }
</script>

<style scoped>
    /*#home{*/
    /*   !*padding-top: 44px;*!*/
    /*    height: 100vh;*/
    /*}*/
    /*.home-nav{*/
    /*    background-color:var(--color-tint);*/
    /*    color: #ffffff;*/

    /*    position: fixed;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    top: 0;*/
    /*    z-index: 9;*/
    /*}*/
    /*.tab-control{*/
    /*    position: sticky;*/
    /*    top: 44px;*/
    /*}*/
    /*.content{*/
    /*    height: calc(100% - 93px);*/
    /*    !*overflow: hidden;*!!*打开会隐藏一半的东西不显示*!*/
    /*    margin-top: 44px;*/
    /*}*/
    #home {
        height: 100vh;
        position: relative;
    }

    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        position: relative;
        z-index: 9;
    }

    .tab-control {
        position: relative;
        z-index: 9;
    }

    .content {
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
    .fixed{
        position: fixed;
        left: 0;
        right: 0;
        top: 44px;
    }
</style>
