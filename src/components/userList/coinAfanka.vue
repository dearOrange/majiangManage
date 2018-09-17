<template>
    <div class="user_content">
		<div class="handsSearch">
			<Input v-model="username" placeholder="请输入用户编号" style="width: 150px"></Input>
			<Input v-model="nickname" placeholder="请输入昵称" style="width: 150px"></Input>
			<Select v-model="model1" style="width:150px" clearable @on-change="changeMain" placeholder="操作大类">
		        <Option v-for="item in cityListMain" :value="item.value" :key="item.value">{{ item.label }}</Option>
		   	</Select>
		   	<Select v-model="model2" style="width:150px" clearable @on-change="changeSub" placeholder="操作子类">
		        <Option v-for="item in cityListSub" :value="item.value" :key="item.value">{{ item.label }}</Option>
		   	</Select>
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
            	model1:'',
            	model2:'',
            	cityNumMain:'',
            	cityNumSub:'',
                columns: [
                    {
                        title: '用户编号',
                        key: 'userId'
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: '操作大类',
                        key: 'operMainType'
                    },
                    {
                        title: '操作子类',
                        key: 'operSubType'
                    },
                    {
                        title: '操作前值',
                        key: 'changeFrom'
                    },
                    {
                        title: '操作后值',
                        key: 'changeTo'
                    },
                    {
                        title: '操作变化值',
                        key: 'changeVal'
                    },
                    {
                        title: '操作描述',
                        key: 'operDesc'
                    },
                    {
                        title: '操作时间',
                        key: 'operTime'
                    }
                ],
                data: [],
                cityListMain:[
                	{
                        value: 'fanka',
                        label: '房卡'
                    },{
                        value: 'coin',
                        label: '金币'
                    }
                ],
                cityListSub:[
                	{
                        value: 'UserBuyItem',
                        label: '商城购买'
                    },{
                        value: 'TaskFinish',
                        label: '任务奖励'
                    },{
                        value: 'RankAward',
                        label: '排行榜奖励'
                    },{
                        value: 'Exchange',
                        label: '兑换'
                    },{
                        value: 'ENROLL',
                        label: '开局服务费'
                    },{
                        value: 'GAME_WIN_LOSE',
                        label: '每局输赢'
                    },{
                        value: 'BANK_ASSIST',
                        label: '破产救济'
                    },{
                        value: 'LOGIN_AWARD',
                        label: '登录奖励'
                    },{
                        value: 'CREATE_ROOM',
                        label: '开房销毁'
                    },{
                        value: 'ADMIN_CHANGE',
                        label: '后台更改'
                    },{
                        value: 'ADMIN_MAIL_ATTACH',
                        label: '邮件附送赠送'
                    },{
                        value: 'MOVE',
                        label: '后台转送'
                    },{
                        value: 'AGENT_CHARGE',
                        label: '从代理商充值'
                    },{
                        value: 'DESTORY_RET',
                        label: '房间销毁退还'
                    },{
                        value: 'OTHER',
                        label: '其他'
                    },{
                        value: 'AA_ROOM',
                        label: 'AA房间支付'
                    }
                ]
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
            		url:that.apiUrl + '/userCurrencyLog/selectCurrencyLog',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken,
					    "currentPage":that.pageNum,
					    "pageSize":10,
					    "id":that.username,
					    "nickname":that.nickname,
					    "mainType":that.cityNumMain,
					    "subType":that.cityNumSub,
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
								if(data[i].operTime == null){
									data[i].operTime = '';
								}else{
									obj.operTime = format(data[i].operTime);
								}
								if(data[i].operMainType == "coin"){
									data[i].operMainType = '金币';
								}else if(data[i].operMainType == "fanka"){
									data[i].operMainType = '房卡';
								}
								
								if(data[i].operSubType == "UserBuyItem"){
									data[i].operSubType = '商城购买';
								}else if(data[i].operSubType == "TaskFinish"){
									data[i].operSubType = '任务奖励';
								}else if(data[i].operSubType == "RankAward"){
									data[i].operSubType = '排行榜奖励';
								}else if(data[i].operSubType == "Exchange"){
									data[i].operSubType = '兑换';
								}else if(data[i].operSubType == "ENROLL"){
									data[i].operSubType = '开局服务费';
								}else if(data[i].operSubType == "GAME_WIN_LOSE"){
									data[i].operSubType = '每局输赢';
								}else if(data[i].operSubType == "BANK_ASSIST"){
									data[i].operSubType = '破产救济';
								}else if(data[i].operSubType == "LOGIN_AWARD"){
									data[i].operSubType = '登录奖励';
								}else if(data[i].operSubType == "CREATE_ROOM"){
									data[i].operSubType = '开房销毁';
								}else if(data[i].operSubType == "ADMIN_CHANGE"){
									data[i].operSubType = '后台更改';
								}else if(data[i].operSubType == "ADMIN_MAIL_ATTACH"){
									data[i].operSubType = '邮件附件赠送';
								}else if(data[i].operSubType == "MOVE"){
									data[i].operSubType = '后台转送';
								}else if(data[i].operSubType == "AGENT_CHARGE"){
									data[i].operSubType = '从代理商充值';
								}else if(data[i].operSubType == "DESTORY_RET"){
									data[i].operSubType = '房间销毁退还';
								}else if(data[i].operSubType == "OTHER"){
									data[i].operSubType = '其他';
								}else if(data[i].operSubType == "AA_ROOM"){
									data[i].operSubType = 'AA房间支付';
								}
								
            					obj.id = data[i].id;
            					obj.userId = data[i].userId;
            					obj.nickname = data[i].nickname;
            					obj.operMainType = data[i].operMainType;
            					obj.operSubType = data[i].operSubType;
            					obj.changeFrom = data[i].changeFrom;
            					obj.changeTo = data[i].changeTo;
            					obj.changeVal = data[i].changeVal;
            					obj.operDesc = data[i].operDesc;
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
            changeMain(value){
            	this.cityNumMain = value;
            },
            changeSub(value){
            	this.cityNumSub = value;
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