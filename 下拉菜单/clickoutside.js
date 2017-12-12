Vue.directive('clickoutside',{
    /*bind:指令第一次绑定到元素上执行初始化*/
    bind:function (el,binding,vnode) {
        function documentHandler(e) {
            //判断点击事件是否发生在绑定的元素内部
            // 如果在绑定的元素内部，返回false
            if(el.contains(e.target)){
                return false;
            }
            //如果在绑定的元素外部，则判断表达式是否存在，执行表达式:handleClose
            if(binding.expression){
                binding.value();
            }
        }
        el._vueClickOutside_=documentHandler;//给绑定的元素增加一个内部方法
        document.addEventListener('click',el._vueClickOutside_);//给document增加一个点击事件监听
    },
    /*unbind:指令与元素解绑时调用*/
    unbind:function (el,binding) {
        document.removeEventListener('click',el._vueClickOutside_);//移除监听
        delete el._vueClickOutside_;//移除
    }
});