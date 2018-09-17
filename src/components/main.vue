<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <Col :span="spanLeft" class="layout-menu-left">
            	<div class="layout-logo-left">兴兴游戏后管</div>
                <Menu :mode="modeType" :active-name="this.$route.path" :open-names="openNames" @on-select="menuSelect" width="auto"  theme="dark" accordion>
	            	<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
		                <Submenu :name="item.name" v-if="!item.leaf">
		                    <template slot="title">
                                <Icon :type="item.iconCls" :size="iconSize"></Icon>
                                <span class="layout-text" >{{item.name}}</span>
                            </template>
                            <template v-for="(child,childIndex) in item.children">
                                <Menu-item :name="child.path">{{child.name}}</Menu-item>
                            </template>
		                </Submenu>
		                <template  v-if="item.leaf&&item.children.length>0">
                            <Menu-item :name="item.children[0].path">
                                 <Icon :type="item.iconCls"></Icon>
                                <span class="layout-text" >{{item.children[0].name}}</span>
                            </Menu-item>
                        </template>
	                </template>
	            </Menu>
            </Col>
            <Col :span="spanRight">
                <div class="layout-header">
                    <Button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                    <div class="userinfo">
                    	<Dropdown placement="bottom-end">
	                        <span class="head-img"><Icon type="person"></Icon>
	                            欢迎回来:  {{useName}} 
	                            <img src="../assets/admin.jpg">
	                        </span>
	                        <Dropdown-menu slot="list">
	                            <Dropdown-item @click.native="modal1 = true">修改密码</Dropdown-item>
	                            <Dropdown-item @click.native="logout()" divided>退出</Dropdown-item>
	                        </Dropdown-menu>
	                	</Dropdown>
                    </div>
                  	
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem href="/usermanage">
					        	<Icon type="ios-home-outline" style="margin-right:5px;"></Icon>Home
				        </BreadcrumbItem>
				        <BreadcrumbItem>
				        	{{$route.name}}
				        </BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                    	<router-view></router-view>
                    </div>
                </div>
            </Col>
        </Row>
        <Modal v-model="modal1" title="修改密码" @on-ok="comfirmModifyPS"  @on-cancel="cancel" >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <Form-item label="原密码" prop="oldPassword">
                    <Input type="password" v-model="formValidate.oldPassword" placeholder="请输入原始密码"></Input>
                </Form-item>
                <Form-item label="新密码" prop="newPassword">
                    <Input type="password" v-model="formValidate.newPassword" placeholder="请输入新密码"></Input>
                </Form-item>
                <Form-item label="确认新密码" prop="resetPassword">
                    <Input type="password" v-model="formValidate.resetPassword" placeholder="请再次输入新密码"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                openNames: [this.$route.matched[0].name],
                modeType: "vertical",
                modal1: false,
                formValidate: {
                    oldPassword: '',
                    newPassword: '',
                    resetPassword:''
                },
                useName:'',
                ruleValidate: {
                    oldPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { type: 'string', min: 6,max: 20, message: '请输入6-20位密码', trigger: 'blur' }
                    ],
                    resetPassword: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' },
                        { type: 'string', min: 6,max: 20, message: '请输入6-20位密码', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            logout() {
            	
            },
            menuSelect(name) {
                this.$router.push({ path: name });
            },
            comfirmModifyPS() {
                let that = this;
                if(that.formValidate.resetPassword == that.formValidate.newPassword){
                	let userToken = sessionStorage.getItem('userNumber');
	                ajax({
	                	type:'post',
	                	url:that.apiUrl + '/admin/resetPwd',
	                	async:true,
	                	data:JSON.stringify({
	                		"adminToken":userToken,
						    "oldPwd":that.formValidate.oldPassword,
						    "newPwd":that.formValidate.newPassword
	                	}),
	                	success:function(res){
	                		if(res.code == 103){
	                			alert(res.msg)
	                		}else if(res.code == 100){
	                			alert(res.msg)
	                		}
	                	}
	                })
                }else{
                	alert('密码请保持一致')
                }
                
            },
            cancel(){
                this.$refs.formValidate.resetFields();
                this.$Message.info('点击了取消');
            },
        },
        mounted(){
        	let that = this;
        	let adminToken = sessionStorage.getItem('userNumber');
        	ajax({
        		type:'post',
        		url:that.apiUrl + '/admin/getAdminInfo',
        		async:true,
        		data:JSON.stringify({
        			"adminToken":adminToken
        		}),
        		success:function(res){
        			if(res.code == 100){
        				that.useName = res.data.name;
        			}else if(res.code == 502){
        				that.$router.push('/login')
        			}
        		}
        	})
        }
    }
</script>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .userinfo{
    	margin-top:50px;
    }
    .head-img {
	    width: 100%;
	    height: 54px;
	    line-height: 54px;
	    float: right;
	    margin-top:-50px;
	}
	.head-img img{
	    border-radius: 20px;
	    margin: 4px 0px 10px 10px;
	    width: 40px;
	    height: 40px;
	    float: right;
	}
	.ivu-dropdown{
		float:right;
	    margin: -44px 70px 0 0;
	}
	.ivu-select-dropdown{
		margin:100px 0;
	}
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
        color:white;
        text-align: center;
        font-size:16px;
        line-height: 30px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .layout-content{
    	padding:15px;
    }
    .layout-content-main{
    	height:100%;
    }
</style>