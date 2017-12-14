Vue.component('list',{
    props:{//接受来自父件的list
        list:{
            list:{
                type:Array,
                default:function () {
                    return [];
                }
            }
        }
    },
    render:function(h) {
        let _this=this;
        let list=[];//存放拼接好的node节点
        this.list.forEach(function (msg,index) {
            //先拼接单个node节点
            let node=h('div',{
                attrs:{
                    class:'list-item'
                },
            },[ h('span',msg.name+':'),
                h('div',{
                    attrs:{
                        class:'list-msg'
                    }
                    },[
                    h('p',msg.message),
                    h('a',{
                        attrs:{
                            class:'list-reply'
                        },
                        on:{
                            click:function () {
                                _this.handleReply(index);
                            }
                        }
                    },'回复'),
                    h('a',{
                        attrs:{
                            class:'list-reply'
                        },
                        on:{
                            click:function () {
                                _this.handleRemove(index);
                            }
                        }
                    },'删除')
            ])],);
            list.push(node);
            /*node格式如下：
              <div class="list-item">
                    <span>msg.name+':'</span>
                    <div class="list-msg">
                        <p>msg.message</p>
                        <a class="list-reply" @click="handleReply">回复</a>
                        <a class="list-reply" @click="handleRemove">删除</a>
                    </div>
              </div>*/
        });
        //根据条件，来返回节点
        if(this.list.length){
            return h('div',{
                attrs:{
                    class:'list'
                }
            },list);
            /*<div class="list">
                    list数组
              </div>
            */
        }else{
            return h('div',{
                attrs:{
                    class:'list-nothing'
                }
            },'留言列表为空');
            /*<div class="list-nothing">
                   留言列表为空
              </div>
            */
        }
    },
    methods:{
        handleReply:function (index) {
            this.$emit('reply',index);//触发reply（回复）事件，在#app父组件中处理
        },
        handleRemove:function (index) {
            this.$emit('delete',index)//触发delete(删除)事件,在#app父组件中处理
        }
    }
});