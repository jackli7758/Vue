Vue.component('vInput',{
    props:{
      value:{
          type:[String,Number],
          default:''
      }
    },
    render:function (h) {
        let _this = this;
        return h('div', [
            h('span','昵称：'),
            h('input',{
                attrs:{
                    type:'text'
                },
                domProps:{//数据双向绑定
                    value:this.value
                },
                on:{//input事件
                    input:function (event) {
                        _this.value=event.target.value;
                        _this.$emit('input',event.target.value);
                    }
                }
            })
        ]);
    }

});
Vue.component('vTextarea',{
    props:{
        value:{
            type:String,
            default:''
        }
    },
    render:function (h) {
        let _this=this;
        return h('div',[
            h('span','留言内容：'),
            h('textarea',{
                attrs:{
                    placeholder:'请输入留言内容'
                },
                domProps:{
                    value:this.value
                },
                ref:'message',//钩子，方便获取dom节点，通过this.$ref.message访问
                on:{
                    input:function (event) {
                        _this.value=event.target.value;
                        _this.$emit('input',event.target.value);
                    }
                }
            })
        ])
    },
    methods:{
        focus:function () {
            this.$refs.message.focus();
        }
    }
});