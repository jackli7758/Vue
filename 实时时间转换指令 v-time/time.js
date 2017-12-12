var Time={
    //获取当前的时间戳
    getUnix:function () {
        let date=new Date();
        return date.getTime();
    },
    //获取今天0点0分0秒的时间戳
    getTodayUnix:function () {
        let date=new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    //获取今年1月1日0点0分0秒的时间戳
    getYearUnix:function () {
        let date=new Date();
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    //获取标准年月日(转换格式):  格式  2017-12-12
    getLastDate:function (time) {
        let date=new Date(time);
        let month=date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
        //用两位数表示月份
        let day=date.getDate()<10?'0'+date.getDate():date.getDate();
        //用两位数表示日
        return date.getFullYear()+'-'+month+'-'+day;
    },
    //时间 转 文字描述
    //timestamp为从服务器上拿到的记录时间
    getFormatTime:function (timestamp) {
        let now=this.getUnix();//当前时间戳
        let today=this.getTodayUnix();//今天0点时间戳
        let year=this.getYearUnix();//今年0点时间戳
        let timer=(now-timestamp)/1000;//秒级时间戳
        let tip='';//文字描述 1小时=60分钟=3600秒
        if(timer<=0){
            tip='刚刚';
        }else if(Math.floor(timer/60)<=0){//1分钟以内
            tip='刚刚';
        }else if(timer<3600){//1小时以内
            tip=Math.floor(timer/60)+'分钟前';
        }else if(timer>=3600 && (timestamp-today>=0)){//今天，1小时前
            tip=Math.floor(timer/3600)+'小时前';
        }else if(timer/86400<=31){//一个月以内
            tip=Math.ceil(timer/86400)+'天前';
        }else{//超过一个月
            tip=this.getLastDate(timestamp);
        }
        return tip;
    }
};
Vue.directive('time',{
    bind:function (el,binding) {
        el.innerHTML=Time.getFormatTime(binding.value);//将格式化的时间，放入绑定的容器中
        el._timeout_=setInterval(function () {//每隔1分钟，更新一次
            el.innerHTML=Time.getFormatTime(binding.value);
        },60000)
    },
    unbind:function (el) {
        clearInterval(el._timeout_);//清除定时器
        delete el._timeout_;//解绑
    }
});