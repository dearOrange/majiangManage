<template>
    <div class="user_content">
		<div class="handsSearch">
			<Input v-model="username" placeholder="请输入代理ID" style="width: 150px"></Input>
			<Input v-model="nickname" placeholder="请输入真实姓名" style="width: 150px"></Input>
			<DatePicker type="datetime" placeholder="开始的日期和时间" style="width: 200px" @on-change="changestart"></DatePicker>
        	<DatePicker type="datetime" placeholder="结束的日期和时间" style="width: 200px" @on-change="changeend"></DatePicker>
			<Button type="ghost" icon="ios-search" @click="handSearch">搜索</Button>
		</div>
		<Table border :columns="columns" :data="data" style="margin:10px 0;"></Table>
		<span v-model="totalRows" style="margin:0 10px;">总记录数：{{totalRows}}</span>
		<span v-model="totalPages">总页数：{{totalPages}}</span>
		<Page :total="pages" :current="pageNum" @on-change="change" style="float:right;margin-right:100px;"></Page>
	</div>
</template>
<script>
    export default {
        data () {
            return {
            	pages:10,
            	pageNum:1,
            	username:'',
            	nickname:'',
            	datestart:'',
            	dateend:'',
            	totalRows:1,
            	totalPages:1,
                columns: [
                    {
                        title: '代理编号',
                        key: 'id'
                    },{
                        title: '真实姓名',
                        key: 'realname'
                    },
                    {
                        title: '上级昵称',
                        key: 'sjnickname'
                    },
                    {
                        title: '上级姓名',
                        key: 'sjrealname'
                    },
                    {
                        title: '等级名称',
                        key: 'agentName'
                    },
                    {
                        title: '身份证号',
                        key: 'idcard'
                    },
                    {
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '上次登录时间',
                        key: 'lastLogin'
                    },
                    {
                        title: '注册时间',
                        key: 'ctime'
                    },
                    {
                        title: '团队人数',
                        key: 'teamCount'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                            	h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.teamshow(params.index)
                                        }
                                    }
                                }, '团队展示')
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
        mounted(){
        	this.userSet()
        },
        methods: {
        	teamshow(index){
        		sessionStorage.setItem("agentId",this.data[index].id)
        		this.$router.push('/teamShow')
        	},
            userSet(){
            	let that = this;
            	let userToken = sessionStorage.getItem('userNumber');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/agent/selectAgentList',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken,
					    "currentPage":that.pageNum,
					    "pageSize":10,
					    "id":that.username,
					    "realname":that.nickname,
					    "startTime":that.datestart,
					   	"endTime":that.dateend
            		}),
            		success:function(res){
            			console.log(res)
            			that.pages = res.data.totalPages*10;
            			that.totalPages = res.data.totalPages;
            			that.totalRows = res.data.totalRows;
            			if(res.code == 100){
            				let data = res.data.resultList;
            				let dataPush = [];
            				for(let i=0;i<data.length;i++){
            					let obj = {};
            					function add0(m){return m<10?'0'+m:m }
								function format(shijianchuo){
									let time = new Date(shijianchuo);
									let y = time.getFullYear();
									let m = time.getMonth()+1;
									let d = time.getDate();
									let h = time.getHours();
									let mm = time.getMinutes();
									let s = time.getSeconds();
									return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
								}
								
								if(data[i].lastLogin == null){
									data[i].lastLogin = '';
								}else{
									obj.lastLogin = format(data[i].lastLogin);
								}
								if(data[i].ctime == null){
									data[i].ctime = '';
								}else{
									obj.ctime = format(data[i].ctime);
								}
								
								if(data[i].status == 0){
									data[i].status = '冻结'
								}else if(data[i].status == 1){
									data[i].status = '正常'
								}
								
            					obj.id = data[i].id;
            					obj.sjnickname = data[i].sjnickname;
            					obj.sjrealname = data[i].sjrealname;
            					obj.agentName = data[i].agentName;
            					obj.realname = data[i].realname;
            					obj.idcard = data[i].idcard;
            					obj.phone = data[i].phone;
            					obj.teamCount = data[i].teamCount;
            					obj.status = data[i].status;
            					dataPush.push(obj);
            				}
            				that.data = dataPush;
            			}else if(res.code == 101){
            				alert(res.msg)
            			}else if(res.code == 502){
            				alert(res.msg);
            				that.$router.push('/login')
            			}
            		}
            	})
            },
        	change (page) {
            	this.pageNum = page;
            	this.userSet();
           },
            changestart(value){
            	this.datestart = value;
            },
            changeend(value){
            	this.dateend = value;
            },
            handSearch(){
            	this.pageNum = 1;
           		this.userSet();
            }
        },
        mounted(){
        	this.userSet()
        }
    }
</script>

<style>
</style>