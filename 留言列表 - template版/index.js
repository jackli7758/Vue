let app=new Vue({
    el:'#app',
    data:{
        username:'',//昵称
        message:'',//留言内容
        list:[]//留言列表,成员为对象
    },
    methods:{
        handleSend:function () {//按发布键，执行此函数，将username和message以对象形式，放入list中
            if(this.username===''){
                window.alert('请输入昵称');
                return;
            }
            if(this.message===''){
                window.alert('请输入留言内容');
                return;
            }
            this.list.push({
                name:this.username,
                message:this.message
            });
            this.message='';//留言内容置空
        },
        handleReply:function (index) {
            let name=this.list[index].name;
            this.message=' 回复@ '+name+': ';
            this.$refs.message.vfocus();
        },
        handleRemove:function (index) {
            this.list.splice(index,1);//splice(要删除的第一项的索引,要删除的项数)
            }
    }
});