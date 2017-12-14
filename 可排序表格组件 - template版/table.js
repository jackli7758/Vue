Vue.component('vTable',{
    //来自父组件的数据
    props:{
        columns:{
            type:Array,
            default:function () {
                return [];
            }
        },
        data:{
            type:Array,
            default:function () {
                return [];
            }
        }
    },
    //避免影响原始数据，添加两个对应props中的数据，组件操作在这两个数据上完成
    data:function () {
        return{
            currentColumns:[],//对应columns数组，数组成员为对象
            currentData:[]    //对应data数组，数组成员为对象
        }
    },
    methods:{
        makeColumns:function () {
            this.currentColumns=this.columns.map(function (col,index) {
                //添加一个内部属性 标识当前列排序的状态，后续使用
                col._sortType='normal';
                //添加一个内部属性 标识当前列在数组中的索引,后续使用
                col._index=index;
                return col;
            })
        },
        makeData:function () {
            this.currentData=this.data.map(function (row,index) {
                //添加一个内部属性 标识当前行在数组中的索引，后续使用
                row._index=index;
                return row;
            });
        },
        handleSortByAsc:function (index) {//index=1 or 2
            let key=this.currentColumns[index].key;//key=age or birthday
            this.currentColumns.forEach(function (col) {
                col._sortType='normal';//全部还原normal(不排序)
            });
            this.currentColumns[index]._sortType='asc';//指定排序asc，添加"on"class
            this.currentData.sort(function (a,b) {
                return a[key]>b[key]?1:-1;//对data进行升序排列  1:-1这样写兼容性比较好
                //a[key]→a.age/a.birthday
            });
        },
        handleSortByDesc:function (index) {
            let key=this.currentColumns[index].key;
            this.currentColumns.forEach(function (col) {
                col._sortType='normal';
            });
            this.currentColumns[index]._sortType='desc';
            this.currentData.sort(function (a,b) {
                return a[key]<b[key]?1:-1;
            });
        }
    },
    template:
        `\
                <table>\
                    <thead>\
                        <tr>\
                           <th v-for="(col,index) in currentColumns">\
                                <span>{{col.title}}</span>\
                                <a v-if="col.sortable" :class="{on:col.sortable}" @click="handleSortByAsc(index)">&uarr;</a>\
                                <a v-if="col.sortable" :class="{on:col.sortable}" @click="handleSortByDesc(index)">&darr;</a>\
                           </th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                        <tr v-for="row in currentData">\
                            <td>{{row.name}}</td>\
                            <td>{{row.age}}</td>\
                            <td>{{row.birthday}}</td>\
                            <td>{{row.address}}</td>\
                        </tr>\
                    </tbody> \
                </table>\
        `
    ,
    watch:{//监听父级的data
        data:function () {
            this.makeData();//更新currentData
            let sortedColumn=this.currentColumns.filter(function (col) {
                return col._sortType!=='normal';
            });//找出_sortType=asc/desc的那列,filter返回的sortedColumn是一个数组,成员是对象
            if(sortedColumn.length>0){//如果是asc/desc 排序状态
                if(sortedColumn[0]._sortType==='asc'){//如果是asc排序
                    this.handleSortByAsc(sortedColumn[0]._index)//重排序
                }else{
                    this.handleSortByDesc(sortedColumn[0]._index)
                }
            }
        }
        
    },
    mounted:function (){//初始化时 调用
        this.makeColumns();
        this.makeData();
    },
});
