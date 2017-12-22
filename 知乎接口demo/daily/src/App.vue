<template>
  <div class="daily">
    <div class="daily-menu">
      <div class="daily-menu-item" :class="{on:type==='recommend'}"
          @click="handleToRecommend">每日推荐</div>
      <div class="daily-menu-item"
           :class="{on:type==='daily'}"
           @click="showThemes=!showThemes">主题日报</div>
      <ul v-show="showThemes">
        <li v-for="item in themes">
          <a :class="{on:item.id===themeId && type==='daily'}"
             @click="handleToTheme(item.id)">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="daily-list" ref="list" @scroll="handleScroll">
      <template v-if="type==='recommend'">
        <div v-for="list in recommendList">
          <div class="daily-date">{{formatDay(list.date)}}</div>
          <Item v-for="item in list.stories"
                :data="item"
                :key="item.id"
                @click.native="handleClick(item.id)"></Item>
        </div>
      </template>
      <template v-if="type==='daily'">
        <Item v-for="item in list"
              :data="item"
              :key="item.id"
              @click.native="handleClick(item.id)"></Item>
      </template>
    </div>
    <daily-article :id="articleId"></daily-article>
  </div>
</template>

<script>
  import $ from './libs/util';
  import Item from './components/item';
  import dailyArticle from './components/daily-article';

export default {
  components:{
    Item,
    dailyArticle
  },
  data(){
    return{
      themes:[],
      showThemes:true,
      type:'recommend',
      themeId:0,
      recommendList:[],
      list:[],
      isLoading:false,
      articleId:0
    }
  },
  methods:{
    getThemes(){
      //axios发起get请求
      $.ajax.get('themes').then(res=>{
        this.themes=res.others;
      })
    },
    handleToTheme(id){
      //改变菜单分类
      this.type='daily';
      //设置当前点击子类的主题日报
      this.themeId=id;
      //清空中间栏数据
      this.list=[];
      $.ajax.get('theme/'+id).then(res=>{
        //过滤掉类型为1的文章，该类型下的文章为空
        this.list=res.stories.filter(item=>item.type!==1);
      })
    },
    handleToRecommend(){
      this.type='recommend';
      this.recommendList=[];
      this.dailyTime=$.getTodayTime();
      this.getRecommendList();
    },
    //获取推荐文章列表数据
    getRecommendList(){
      this.isLoading=true;
      const prevDay=$.prevDay(this.dailyTime+86400000);
      //dailyTime为当日0点，要多加一天时间
      //假设今天15号，15号文章还没上线，现在想要查询13号文章，那么prevDay需要是14
      $.ajax.get('news/before/'+prevDay).then(res=>{
        this.recommendList.push(res);
        this.isLoading=false;
      })
    },
    //格式转换=>样式:5月2日
    formatDay(date){                //2017 05 02   日期   通过prevDay()函数获得date参数
      let month=date.substr(4,2);  //0123 45 67   索引   在util.js文件中
      let day=date.substr(6,2);
      if(month.substr(0,1)==='0') month=month.substr(1,1);
      if(day.substr(0,1)==='0') day=day.substr(1,1);
      return `${month}月${day}日`
    },
    handleScroll(){
      const $list=this.$refs.list;//获取DOM
      //监听中栏的滚动事件
      $list.addEventListener('scroll',()=>{
        //在“主题日报”或正在加载推荐列表时停止操作
        if(this.type==='daily'||this.isLoading) return;
        //已经滚动的距离加页面的高度等于整个内容区域高度时，视为接触底部
        if($list.scrollTop+document.body.clientHeight>=$list.scrollHeight){
          this.dailyTime-=86400000;//时间相对减少一天
          this.getRecommendList();//更新列表内容
        }
      });
    },
    handleClick(id){
      this.articleId=id;
    }
  },
  mounted(){
    //初始化时调用
    this.getThemes();
    this.getRecommendList();
    this.handleToRecommend();
  }
}
</script>

<style>

</style>
