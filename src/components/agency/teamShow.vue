<template>
	<div class="level_box">
		<div class="handSearch">
			<Select v-model="model1" style="width:150px" clearable @on-change="changeCount" placeholder="等级搜索">
		        <Option v-for="item in cityListCount" :value="item.value" :key="item.value">{{ item.label }}</Option>
		   </Select>
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
            	totalRows:1,
            	totalPages:1,
            	model1:'',
            	cityNumCount:'',
                columns: [
                    {
                        title: '代理id',
                        key: 'id'
                    },
                    {
                        title: '下级代理等级',
                        key: 'agentName'
                    },
                    {
                        title: '下级代理名称',
                        key: 'realname'
                    },
                    {
                        title: '团队中代理等级',
                        key: 'count'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    }
                ],
                data: [],
                cityListCount:[
                	{
                        value: 1,
                        label: '一级'
                    },{
                        value: 2,
                        label: '二级'
                    },{
                        value: 3,
                        label: '三级'
                    }
                ],
            }
        },
        methods: {
            levelDetail(){
            	let that  = this;
            	let userToken = sessionStorage.getItem('userNumber');
            	let idToken = sessionStorage.getItem('agentId');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/agent/selectAgentTeamList',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken,
            			"currentPage":that.pageNum,
					    "pageSize":10,
					    "id":idToken,
					    "count":that.cityNumCount
            		}),
            		success:function(res){
            			that.pages = res.data.totalPages*10;
            			that.totalPages = res.data.totalPages;
            			that.totalRows = res.data.totalRows;
            			if(res.code == 100){
            				let data = res.data.resultList;
            				let levelArr = [];
            				for(let i=0;i<data.length;i++){
            					let obj = {};
            					obj.id = data[i].id;
            					obj.agentName = data[i].agentName;
            					obj.realname = data[i].realname;
            					if(data[i].status == 0){
            						data[i].status = '冻结'
            					}else if(data[i].status == 1){
            						data[i].status = '正常'
            					}
            					
            					if(data[i].count == 1){
            						data[i].count = '一级'
            					}else if(data[i].count == 2){
            						data[i].count = '二级'
            					}else if(data[i].count == 3){
            						data[i].count = '三级'
            					}
            					obj.count = data[i].count;
            					obj.status = data[i].status;
            					levelArr.push(obj);
            				}
            				that.data = levelArr;
            			}else if(res.code == 502){
            				alret(res.msg);
            				that.$router.push('/login')
            			}else if(res.code == 101){
            				alret(res.msg);
            			}
            		}
            	})
            },
            change (page) {
            	this.pageNum = page;
            	this.userSet();
            },
            changeCount(value){
            	this.cityNumCount = value;
            },
            handSearch(){
            	this.pageNum = 1;
           		this.levelDetail();
            }
        },
        mounted(){
        	this.levelDetail()
        }
    }
</script>

<style>
</style>