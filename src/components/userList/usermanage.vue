<template>
	<div class="user_content">
		<div class="handsSearch">
			<Input v-model="username" placeholder="请输入用户名" style="width: 150px"></Input>
			<Input v-model="nickname" placeholder="请输入用户昵称" style="width: 150px"></Input>
			<Input v-model="bindedmobile" placeholder="请输入绑定的手机号" style="width: 150px"></Input>
			<DatePicker type="datetime" placeholder="开始的日期和时间" style="width: 200px" @on-change="changestart"></DatePicker>
        	<DatePicker type="datetime" placeholder="结束的日期和时间" style="width: 200px" @on-change="changeend"></DatePicker>
        	<Select v-model="model1" style="width:150px" clearable @on-change="changeSub" placeholder="时间排序搜索">
		        <Option v-for="item in cityListSub" :value="item.value" :key="item.value">{{ item.label }}</Option>
		   	</Select>
			<Button type="ghost" icon="ios-search" @click="handSearch">搜索</Button>
			<Button @click="coin_modal1 = true" icon="social-usd">金币充值</Button>
        	<Button @click="fanka_modal1 = true">房卡充值</Button>
		</div>
		<Table style="margin:10px 0;" border ref="selection" :columns="columns" :data="data" @on-selection-change='selectBox'></Table>
		<span v-model="totalRows" style="margin:0 10px;">总记录数：{{totalRows}}</span>
		<span v-model="totalPages">总页数：{{totalPages}}</span>
		<Page :total="pages" :current="pageNum" @on-change="change" style="float:right;margin-right:100px;"></Page>
		<Modal v-model="coin_modal1" title="金币充值" @on-ok="coinRecharges" @on-cancel="coincancel">
	        <Input v-model="coinNum" placeholder="请输入金币数量"></Input>
	    </Modal>
	    <Modal v-model="fanka_modal1" title="房卡充值" @on-ok="fankaRecharges" @on-cancel="fankacancel">
	        <Input v-model="fankaNum" placeholder="请输入房卡数量"></Input>
	    </Modal>
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
            	bindedmobile:'',
            	datestart:'',
            	dateend:'',
            	coinNum:'',
            	fankaNum:'',
            	totalRows:1,
            	totalPages:1,
            	bindedMatch:0,
            	coin_modal1:false,
            	fanka_modal1:false,
            	model1:'',
            	cityNumSub:'',
                columns: [
                	{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: '用户类型',
                        key: 'userType'
                    },
                    {
                        title: '性别',
                        key: 'gender'
                    },
                    {
                        title: '手机',
                        key: 'phone'
                    },
                    {
                        title: '头像id',
                        key: 'headImg'
                    },
                    {
                        title: '金币',
                        key: 'coin'
                    },
                    {
                        title: '房卡',
                        key: 'fanka'
                    },
                    {
                        title: '角色',
                        key: 'role'
                    },{
                        title: '在线时长(分)',
                        key: 'bindedMatch'
                    },
                    {
                        title: '上次登录时间',
                        key: 'lastLogin'
                    },
                    {
                        title: '创建时间',
                        key: 'ctime'
                    },
                    {
                        title: '修改时间',
                        key: 'mtime'
                    }
                ],
                data: [],
                cityListSub:[
                	{
                        value: 'desc',
                        label: '时间倒序'
                    },{
                        value: 'asc',
                        label: '时间正序'
                    }
                ],
            }
        },
        methods: {
        	selectBox(selection){
        		let that = this;
        		let selectArr = [];
        		for(let i=0;i<selection.length;i++){
        			selectArr.push(selection[i].id)
        		}
        		sessionStorage.setItem('selectArrs',selectArr)
        	},
            coinRecharges(){
            	let that = this;
            	let coinToken = sessionStorage.getItem('userNumber');
            	let coinSelectStr = sessionStorage.getItem('selectArrs');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/user/chargeFankaCoin',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":coinToken,
            			"id":coinSelectStr,
					    "coin":that.coinNum
            		}),
            		success:function(res){
            			if(res.code == 100){
            				that.userSet();
            				that.coinNum = '';
            			}else if(res.code == 101){
            				alert(res.msg)
            			}
            		}
            	})
            },
            coincancel(){
            	this.$Message.info('点击了取消');
            	this.coinNum = '';
            },
            fankaRecharges(){
            	let that = this;
            	let fankaToken = sessionStorage.getItem('userNumber');
            	let fankaSelectStr = sessionStorage.getItem('selectArrs');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/user/chargeFankaCoin',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":fankaToken,
            			"id":fankaSelectStr,
					    "fanka":that.fankaNum
            		}),
            		success:function(res){
            			if(res.code == 100){
            				that.userSet();
            				that.fankaNum = '';
            			}else if(res.code == 101){
            				alert(res.msg)
            			}
            		}
            	})
            },
            fankacancel(){
            	this.$Message.info('点击了取消');
            	this.fankaNum = '';
            },
            userSet(){
            	let that = this;
            	let userToken = sessionStorage.getItem('userNumber');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/user/selectUserList',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken,
					   	"currentPage":that.pageNum,
					   	"pageSize":10,
					   	"user_name":that.username,
					   	"nickname":that.nickname,
					   	"binded_mobile":that.bindedmobile,
					   	"startTime":that.datestart,
					   	"endTime":that.dateend,
					   	"paixu":that.cityNumSub
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
								if(data[i].ctime == null){
									data[i].ctime = '';
								}else{
									obj.ctime = format(data[i].ctime);
								}
								if(data[i].mtime == null){
									data[i].mtime = '';
								}else{
									obj.mtime = format(data[i].mtime);
								}
								if(data[i].lastLogin == null){
									data[i].lastLogin = '';
								}else{
									obj.lastLogin = format(data[i].lastLogin);
								}
								if(data[i].userType == 0){
									data[i].userType = '游戏'
								}else if(data[i].userType == 1){
									data[i].userType = '手机用户'
								}else if(data[i].userType == 2){
									data[i].userType = 'qq/weixin'
								}
								if(data[i].gender == 0){
									data[i].gender = '未知'
								}else if(data[i].gender == 1){
									data[i].gender = '男性'
								}else if(data[i].gender == 2){
									data[i].gender = '女性'
								}
								if(data[i].deviceType == 1){
									data[i].deviceType = 'ios'
								}else if(data[i].deviceType == 2){
									data[i].deviceType = 'android '
								}else if(data[i].deviceType == 3){
									data[i].deviceType = 'winphon '
								}else if(data[i].deviceType == 4){
									data[i].deviceType = 'other'
								}
								if(data[i].role == 1){
									data[i].role = '管理员'
								}else if(data[i].role == 2){
									data[i].role = '已授权 '
								}
            					obj.id = data[i].id;
            					obj.userType = data[i].userType;
            					obj.userName = data[i].userName;
            					obj.nickname = data[i].nickname;
            					obj.gender = data[i].gender;
            					obj.phone = data[i].phone;
            					obj.coin = data[i].coin;
            					obj.fanka = data[i].fanka;
            					obj.bindedMatch = data[i].bindedMatch;
            					obj.headImg = data[i].headImg;
            					obj.bindedMobile = data[i].bindedMobile;
            					obj.deviceType = data[i].deviceType;
            					obj.role = data[i].role;
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
            changeSub(value){
            	this.cityNumSub = value;
            },
            handSearch(){
            	this.pageNum = 1;
           		this.userSet();
            }
        },
        mounted(){
        	this.userSet();
        }
    }
</script>

<style scoped>
	.handsSearch{
		margin:10px 0;
	}
</style>