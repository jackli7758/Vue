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
    template:'\
            <div v-if="this.list.length">\
                <div class="list">\
                  <div class="list-item" v-for="(msg,index) in list">\
                        <span>{{msg.name+\':\'}}</span>\
                        <div class="list-msg">\
                            <p>{{msg.message}}</p>\
                            <a class="list-reply" @click="handleReply(index)">回复</a>\
                            <a class="list-reply" @click="handleRemove(index)">删除</a>\
                        </div>\
                  </div>\
                </div>\
            </div>\
            <div v-else>\
                <div class="list-nothing">留言列表为空 </div>\
            </div>',
    methods:{
        handleReply:function (index) {
            this.$emit('reply',index);//触发reply（回复）事件，在#app父组件中处理
        },
        handleRemove:function (index) {
            this.$emit('delete',index)//触发delete(删除)事件,在#app父组件中处理
        }
    }
});