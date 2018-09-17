<template>
	<div id="login_box">
		<Form ref="formInline" :model="formInline" :rules="ruleInline" class="form_box">
	    	<Form-item class="formLogin-title">
			        <h3>系统登录</h3>
			</Form-item>
	        <FormItem prop="user">
	            <Input type="text" v-model="formInline.user" placeholder="Username">
	                <Icon type="ios-person-outline" slot="prepend"></Icon>
	            </Input>
	        </FormItem>
	        <FormItem prop="password">
	            <Input type="password" v-model="formInline.password" placeholder="Password">
	                <Icon type="ios-locked-outline" slot="prepend"></Icon>
	            </Input>
	        </FormItem>
	        <Form-item class="login-no-bottom">
	            <Row >
	                <Col :xs="{ span: 4, offset: 6 }" >
	                    <Button type="primary" id="login" @click="handleSubmit('formInline')">登录</Button>
	                </Col>
	                <Col :xs="{ span: 4, offset: 6 }">
	                    <Button  type="primary" id="resert" @click="formLoginReset('formInline')">重置</Button>
	                </Col>
	            </Row>
	        </Form-item>
	    </Form>
	</div>
    
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	let that = this;
                        ajax({
                        	type:'post',
                        	url:that.apiUrl + '/admin/login',
                        	async:true,
                        	data:JSON.stringify({
                        		"account":that.formInline.user,
    							"pwd":that.formInline.password
                        	}),
                        	success:function(res){
                        		sessionStorage.setItem('userNumber',res.adminToken);
                        		if(res.code == 100){
                        			that.$router.push('/usermanage')
                        		}else if(res.code == 101){
                        			alert(res.msg)
                        		}else if(res.code == 102){
                        			alert(res.msg)
                        		}else if(res.code == 103){
                        			alert(res.msg)
                        		}
                        	}
                        })
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            formLoginReset(name){
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>
	#login_box{
		width:100%;
		height:100%;
		background:url(../assets/login_bg.jpg);
		background-size:100% 100%;
	}
	.form_box{
		position: absolute;
		right:300px;
		top:180px;
		padding: 20px;
	    -webkit-border-radius: 5px;
	    border-radius: 5px;
	    -moz-border-radius: 5px;
	    margin-bottom: 20px;
	    background-color: #F9FAFC;
	    width: 400px;
	}
	.formLogin-title {
      	text-align: center;
      	font-size: 28px;
	}
	.formLogin-title h3{
	    font-size: 18px;
	}
	.login-no-bottom {
      	margin-bottom: 10px;
  	}
</style>