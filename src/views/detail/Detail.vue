<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        <scroll class="content"
                ref="scroll"
                @scroll="contentScroll"
                :probe-type="3">
<!--            <ul>-->
<!--                <li v-for="item in $store.state.cartList">{{item}}</li>-->
<!--            </ul>-->
            <detail-swiper :top-images="topImages"></detail-swiper>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <goods-list ref="recommend" :goods="recommends"></goods-list>
        </scroll>
        <backtop @click.native="backTop" v-show="showBackTop"></backtop>
        <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
<!--        <toast :message="message" :show="show"></toast>-->


    </div>

</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import Scroll from "components/common/scroll/Scroll";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import GoodsList from "components/content/goods/GoodsList";
    import DetailBottomBar from "./childComps/DetailBottomBar";
    import Backtop from "components/common/backtop/Backtop";
    // import Toast from "components/common/toast/Toast";

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail';
    import {debounce} from "common/utils";
    // import Toast from "../../components/common/toast/Toast";


    export default {
        name: "Detail",
        components:{
            // Toast,
           DetailNavBar,
           DetailSwiper,
           DetailBaseInfo,
           DetailShopInfo,
           Scroll,
           DetailGoodsInfo,
           DetailParamInfo,
           DetailCommentInfo,
           GoodsList,
           DetailBottomBar,
           Backtop,
           // Toast
        },
        data(){
            return {
               iid:'',
               topImages:[],
               goods:{},
               shop:{},
               detailInfo:{},
               paramInfo:{},
               commentInfo:{},
               recommends:[],
               itemImgListener:null,
               themeTopYs:[],//记录标题的位置，方便点击时跳转
               getThemeTopYs:null,
               currentIndex:0,
               showBackTop:false,
               // message:'',
               // show:false


            }
        },
        created() {
            //取出iid,动态路由
            this.iid=this.$route.params.id
            //发送商品请求
            this._getDetail(this.iid)
            //发送推荐请求
            this._getRecommend()
            //获取对应title的offsetTop
            //给getThemeTopYs赋值，防抖，避免图片频繁调用
            this.getThemeTopYs=debounce(()=>{
                this.themeTopYs=[];
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.param.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
                // console.log(this.themeTopYs);
            })
        },
        methods:{
            _getDetail(iid){
                getDetail(iid).then(res=>{
                    //获取数据
                    const data=res.result;
                    //获取顶部的图片数据
                    this.topImages=data.itemInfo.topImages;
                    //获取商品信息
                    this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
                    //获取店铺信息
                    this.shop=new Shop(data.shopInfo)
                    //获取商品的详细信息
                    this.detailInfo=data.detailInfo;
                    //获取商品参数信息
                    this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)
                    //获取评论信息
                    if(data.rate.list){
                        this.commentInfo=data.rate.list[0];
                    };
                    //获取对应title的offsetTop
                    //第二次值不对的原因：dom是已经被渲染了，但是图片还没有加载完，获取到的offsetTop
                    //不包含其中的图片，offsetTop值不对时，都是因为图片的问题
                    // this.$nextTick(()=>{
                    //     this.themeTopYs=[];
                    //     this.themeTopYs.push(0);
                    //     this.themeTopYs.push(this.$refs.param.$el.offsetTop)
                    //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                    //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                    //     console.log(this.themeTopYs);
                    // })
                    //第一次值不对的原因：this.$refs.param.$el没有渲染
                    // this.themeTops=[];
                    // this.themeTops.push(0);
                    // this.themeTops.push(this.$refs.param.$el.offsetTop)
                    // this.themeTops.push(this.$refs.comment.$el.offsetTop)
                    // this.themeTops.push(this.$refs.recommend.$el.offsetTop)
                    // console.log(this.themeTops);

                })
            },
            _getRecommend(){
                getRecommend().then(res=>{
                    // console.log(res);
                    this.recommends=res.data.list
                })
            },
            //解决滚动不动的问题,图片加载完
            imageLoad(){
               this.$refs.scroll.refresh();
                //第三次值对，图片已加载完
               this.getThemeTopYs()

            },
            titleClick(index){
                //跳转到title对应的部分
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
            },
            //图片到title对应的位置，title产生变化
            contentScroll(position){
                //决定backTop按钮是否显示
                this.showBackTop=position.y<=-1000
                //获取Y值,监听滚动到某个主题
                const positionY=-position.y
                // console.log(positionY);
                let length=this.themeTopYs.length;
                for(let i=0;i<length-1;i++){
                    //方法一
                    // if(this.currentIndex!==i&&((i<length-1&&positionY>=this.themeTopYs[i]&&positionY <
                    //     this.themeTopYs[i+1])||(i===length-1&&positionY>=this.themeTopYs[i]))){
                    //     this.currentIndex=i;
                    //     // console.log(this.currentIndex);
                    //     this.$refs.nav.currentIndex=this.currentIndex;
                    //
                    // }
                    //方法二，优化
                    if(this.currentIndex!==i&&(positionY>=this.themeTopYs[i]&&
                    positionY<this.themeTopYs[i+1])){
                        this.currentIndex=i;
                        this.$refs.nav.currentIndex=this.currentIndex;
                    }
                }

            },
            //先计算出position的位置，是否展示backTop按钮，然后返回到顶部
            backTop(){
               this.$refs.scroll.scrollTo(0,0)
            },
            addToCart(){
                //获取购物车需要展示的信息
                const product={};
                product.image=this.topImages[0];
                product.title=this.goods.title;
                product.desc=this.goods.desc;
                product.iid=this.iid;
                product.price=this.goods.realPrice;
                // console.log(this.goods);
                //将商品添加到购物车里
                // this.$store.commit('addCart',product)
                this.$store.dispatch('addCart',product).then(res=>{
                   this.$toast.show(res);
                    // this.show=true;
                    // this.message=res;
                    // setTimeout(()=>{
                    //     this.show=false;
                    //     this.message=''
                    // },1500)
                    // console.log(res);//将添加的信息从vuex中调用一次
                })
                // this.$router.push('/cart')//路由跳转到购物车页面

            }

        },
        mounted() {
            const refresh=debounce(this.$refs.scroll.refresh,100)
            this.itemImgListener=()=>{
                refresh()
            }
            this.$bus.$on('imgLoad',this.itemImgListener)
        },
        destroyed() {
            this.$bus.$off('imgLoad',this.itemImgListener())
        }
    }
</script>

<style scoped>
    #detail{
        height: 100vh;
        position: relative;
        z-index: 9;/*将首页中的下面导航去掉*/
        background-color: #fff;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;

    }
    .content{
        position: absolute;
        top: 44px;
        bottom: 58px;
        left: 0;
        right: 0;
        overflow: hidden;/*防止加入购物车栏滑到下面去，不出现在页面中*/
    }

</style>