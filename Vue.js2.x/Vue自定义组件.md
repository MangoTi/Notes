1、在父组件中引入子组件：

	import searchInput from '@/views/my-components/searchInput.vue'
	export default {
		name: "add-qs",
		components:{
				searchInput
		},
	}
	
在标签中使用
	<searchInput placeholder="请输入课程关键词进行检索" type='name' v-model="courseName">
	</searchInput>

2、在子组件中，prop为子组件的属性，与data的区别就是prop是父级在引用的时候给的，使用的时候就跟data中的数据一样用

	<Input :placeholder="placeholder" icon="ios-arrow-down" @on-keyup="search" v-model="value"/>

	export default {
	    name: "search-input",
	    props:{
		placeholder:{
		    type:String,
		    default:'请输入搜索内容'
		},
		type:{
		    required:true,//是否必须
		    type:String,//类型
		}
	    },
	    data(){
		return {
		     value:'',
		     id:''
		}
	    },
	    methods:{
		search(){
		     this.id='1';
		     this.$emit('input', this.value);
		     this.$emit('on-change', this.id)
		}
	    }
	}

3、子组件中输入的值要传递给父级，只能通过emit方法
this.$emit('input', this.value)，第一个参数是父级中的方法，第二个参数是传递给父级的参数，就是当search方法被调用的时候，调用父级的
input方法，如果只传递一个值，在父级可以不用写input方法，如果还要传一个id，父级中的标签要写@on-change='getCourseId',然后该方法的
形参就是子组件中的第二个参数

	getCourseId(id){
	     console.log(id);
	}
