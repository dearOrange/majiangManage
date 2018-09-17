<template>
    <div class="user_content">
		<div class="handsSearch">
			<Input v-model="username" placeholder="请输入充值人id" style="width: 150px"></Input>
			<Input v-model="nickname" placeholder="请输入被充值人id" style="width: 150px"></Input>
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
                        title: '充值人Id',
                        key: 'fromUserId'
                    },
                    {
                        title: '昵称',
                        key: 'fromUserName'
                    },
                    {
                        title: '被充值人Id',
                        key: 'toUserId'
                    },
                    {
                        title: '被充值人昵称',
                        key: 'toUserName'
                    },
                    {
                        title: '充值数量',
                        key: 'dealAmount'
                    },
                    {
                        title: '充值时间',
                        key: 'dealDate'
                    },
                    {
                        title: '备注说明',
                        key: 'dealDesc'
                    }
                ],
                data: []
            }
        },
        mounted(){
        	this.userSet()
        },
        methods: {
            userSet(){
            	let that = this;
            	let userToken = sessionStorage.getItem('userNumber');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/userCurrencyLog/selectChargeFanka',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken,
					    "currentPage":that.pageNum,
					    "pageSize":10,
					    "from_user_id":that.username,
					    "to_user_id":that.nickname,
					    "startTime":that.datestart,
					   	"endTime":that.dateend
            		}),
            		success:function(res){
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
								
								if(data[i].dealDate == null){
									data[i].dealDate = '';
								}else{
									obj.dealDate = format(data[i].dealDate);
								}
								
            					obj.id = data[i].id;
            					obj.fromUserId = data[i].fromUserId;
            					obj.fromUserName = data[i].fromUserName;
            					obj.toUserId = data[i].toUserId;
            					obj.toUserName = data[i].toUserName;
            					obj.dealAmount = data[i].dealAmount;
            					obj.dealDesc = data[i].dealDesc;
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
        }
    }
</script>

<style>
</style>