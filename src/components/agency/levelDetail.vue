<template>
	<div class="level_box">
		<Table border :columns="columns" :data="data"></Table>
		<Modal v-model="changeModal" title="修改等级内容" @on-ok="changeObject('changeForm')" @on-cancel="objCancel">
	        <Form ref="changeForm" :model="changeForm" :rules="ruleValidate" :label-width="100">
		        <FormItem label="等级名称" prop='agentName'>
		            <Input v-model="changeForm.agentName"></Input>
		        </FormItem>
		        <FormItem label="一级提成比例" prop='commission1'>
		            <Input v-model="changeForm.commission1"></Input>
		        </FormItem>
		        <FormItem label="二级提成比例" prop='commission2'>
		            <Input v-model="changeForm.commission2"></Input>
		        </FormItem>
		        <FormItem label="三级提成比例" prop='commission3'>
		            <Input v-model="changeForm.commission3"></Input>
		        </FormItem>
		        <FormItem label="个人充值金额" prop='personRecharge'>
		            <Input v-model="changeForm.personRecharge"></Input>
		        </FormItem>
		        <FormItem label="团队充值金额" prop='teamRecharge'>
		            <Input v-model="changeForm.teamRecharge"></Input>
		        </FormItem>
		        <FormItem label="团队人数" prop='teamNum'>
		            <Input v-model="changeForm.teamNum"></Input>
		        </FormItem>
		        <FormItem label="能拿几级提成" prop='getCount'>
		            <Input v-model="changeForm.getCount"></Input>
		        </FormItem>
		        <FormItem label="备注" prop='note'>
		            <Input v-model="changeForm.note"></Input>
		        </FormItem>
    		</Form>
	    </Modal>
	</div>
</template>
<script>
    export default {
        data () {
        	const valTocNum = (rule, value, callback) => {
				const re = new RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/);
	            if (value === '') {
	                callback(new Error('请输入百分比'));
	            }else if(!re.test(value)){
	            	callback(new Error('请输入正确的格式(如:10%)'));
	            }else{
	            	callback();
	            }
	        };
	        const coinNum = (rule, value, callback) => {
	    		const reNum = /^[1-9]+$/;//数字正则
	            if (value === '') {
	                callback(new Error('请输入数字'));
	            }else if(!reNum.test(value)){
	            	callback(new Error('请输入正确的格式'));
	            }else{
	            	callback();
	            }
	        };
            return {
            	changeModal:false,
            	changeForm:{
            		agentName:'',
            		commission1:'',
            		commission2:'',
            		commission3:'',
            		personRecharge:'',
            		teamRecharge:'',
            		teamNum:'',
            		getCount:'',
            		note:''
            	},
            	levelNum:0,
                columns: [
                    {
                        title: '等级编号',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'agentName'
                    },
                    {
                        title: '一级提成比例',
                        key: 'commission1'
                    },
                    {
                        title: '二级提成比例',
                        key: 'commission2'
                    },
                    {
                        title: '三级提成比例',
                        key: 'commission3'
                    },
                    {
                        title: '能拿几级提成',
                        key: 'getCount'
                    },
                    {
                        title: '个人充值金额',
                        key: 'personRecharge'
                    },
                    {
                        title: '团队充值金额',
                        key: 'teamRecharge'
                    },
                    {
                        title: '团队人数',
                        key: 'teamNum'
                    },
                    {
                        title: '备注',
                        key: 'note'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            return h('div',this.data[params.index].isEnable == '禁用' ? [
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
                                            this.qiyong(params.index)
                                        }
                                    }
                                }, '启用'),
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeLevel(params.index)
                                        }
                                    }
                                }, '修改')
                            ]:[
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
                                            this.jinyong(params.index)
                                        }
                                    }
                                }, '禁用'),
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeLevel(params.index)
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data: [],
                ruleValidate: {
                    agentName: [
                        { required: true, message: '等级名称不能为空', trigger: 'blur' }
                    ],
                    commission1: [
                        { required: true, message: '一级提成比例不能为空', trigger: 'blur' },
                        { validator: valTocNum, trigger: 'blur' }
                    ],
                    commission2: [
                        { required: true, message: '二级提成比例不能为空', trigger: 'blur' },
                        { validator: valTocNum, trigger: 'blur' }
                    ],
                    commission3: [
                        { required: true, message: '三级提成比例不能为空', trigger: 'blur' },
                        { validator: valTocNum, trigger: 'blur' }
                    ],
                    personRecharge: [
                        { required: true, message: '个人充值金额不能为空', trigger: 'blur' },
                        { validator: coinNum, trigger: 'blur' }
                    ],
                    teamRecharge: [
                        { required: true, message: '团队充值金额不能为空', trigger: 'blur' },
                        { validator: coinNum, trigger: 'blur' }
                    ],
                    teamNum: [
                        { required: true, message: '团队人数不能为空', trigger: 'blur' },
                        { validator: coinNum, trigger: 'blur' }
                    ],
                    note: [
                        { type: 'string', min: 0, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: `姓名：${this.data[index].name}<br>年龄：${this.data[index].age}<br>地址：${this.data[index].address}`
                })
            },
            changeLevel (index) {
                this.changeModal = true;
                this.levelNum = index;
                this.changeForm.agentName = this.data[index].agentName;
                this.changeForm.getCount = this.data[index].getCount;
                this.changeForm.commission1 = this.data[index].commission1;
                this.changeForm.commission2 = this.data[index].commission2;
                this.changeForm.commission3 = this.data[index].commission3;
                this.changeForm.personRecharge = this.data[index].personRecharge;
                this.changeForm.teamRecharge = this.data[index].teamRecharge;
                this.changeForm.teamNum = this.data[index].teamNum;
                this.changeForm.note = this.data[index].note;
            },
            changeObject(name){
            	this.$refs[name].validate((valid) => {
                    if (valid) {
		            	let that = this;
		            	let changeToken = sessionStorage.getItem('userNumber');
		            	ajax({
		            		type:'post',
		            		url:that.apiUrl + '/agentGrade/updateGrade',
		            		async:true,
		            		data:JSON.stringify({
		            			"adminToken":changeToken,
							    "id":that.data[that.levelNum].id,
							    "agentName":that.changeForm.agentName,
							    "commission1":that.changeForm.commission1,
							    "commission2":that.changeForm.commission2,
							    "commission3":that.changeForm.commission3,
							    "personal_recharge":that.changeForm.personRecharge,
							    "team_recharge":that.changeForm.teamRecharge,
							    "team_num":that.changeForm.teamNum,
							    "getCount":that.changeForm.getCount,
							    "note":that.changeForm.note
		            		}),
		            		success:function(res){
		            			if(res.code == 100){
		            				alert(res.msg);
		            				that.levelDetail()
		            			}else if(res.code == 101){
		            				alert(res.msg);
		            			}else if(res.code == 502){
		            				alert(res.msg);
		            				that.$router.push('/login')
		            			}
		            		}
		            	})
	            	} else {
	                    this.$Message.error('表单验证失败!');
	                }
	            })
            },
            objCancel(){
            	this.$Message.info('点击了取消');
            },
            levelDetail(){
            	let that  = this;
            	let userToken = sessionStorage.getItem('userNumber');
            	ajax({
            		type:'post',
            		url:that.apiUrl + '/agentGrade/selectAgentGradeList',
            		async:true,
            		data:JSON.stringify({
            			"adminToken":userToken
            		}),
            		success:function(res){
            			if(res.code == 100){
            				let data = res.data;
            				let levelArr = [];
            				for(let i=0;i<data.length;i++){
            					let obj = {};
            					obj.id = data[i].id;
            					obj.agentName = data[i].agentName;
            					obj.getCount = data[i].getCount;
            					if(data[i].isEnable == 0){
            						data[i].isEnable = '启用'
            					}else if(data[i].isEnable == 1){
            						data[i].isEnable = '禁用'
            					}
            					obj.identity = data[i].identity;
            					obj.isEnable = data[i].isEnable;
            					obj.note = data[i].note;
            					obj.commission1 = JSON.parse(data[i].commission).commission1;
            					obj.commission2 = JSON.parse(data[i].commission).commission2;
            					obj.commission3 = JSON.parse(data[i].commission).commission3;
            					obj.personRecharge = JSON.parse(data[i].condition).personal_recharge;
            					obj.teamRecharge = JSON.parse(data[i].condition).team_recharge;
            					obj.teamNum = JSON.parse(data[i].condition).team_num;
            					levelArr.push(obj);
            					
            				}
            				that.data = levelArr;
            			}else if(res.code == 502){
            				alret(res.msg);
            				that.$router.push('/login')
            			}
            		}
            	})
            }
        },
        mounted(){
        	this.levelDetail()
        }
    }
</script>

<style>
</style>