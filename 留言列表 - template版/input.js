Vue.component('vInput',{
    props:{
      value:{
          type:[String,Number],
          default:''
      }
    },
    template:'\
    <div>\
        <span>昵称:</span>\
        <input type="text" :value="value" @input="vinputfunction">\
    </div>\
    ',
    methods:{
        vinputfunction:function (event) {
            this.$emit('input',event.target.value);
        }
    }
});
Vue.component('vTextarea',{
    props:{
        value:{
            type:String,
            default:''
        }
    },
    template:'\
    <div>\
        <span>留言内容：</span>\
        <textarea ref="message" placeholder="请输入留言内容" :value="value" @input="vtextareafunction"/>\
    </div>\
    ',
    methods:{
        vfocus:function () {
            this.$refs.message.focus();
        },
        vtextareafunction:function (event) {
            this.$emit('input',event.target.value);
        }
    }
});