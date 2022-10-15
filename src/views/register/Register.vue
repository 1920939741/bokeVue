<script src="../main.js"></script>
<Particles></Particles>
<template>
    <div>
      <Particles></Particles>
      <div class="register">
        <div class="myRegister" align="center">
          <h4>注册</h4>
          <el-form :label-position="labelPosition"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" >
             <el-form-item label="账号" prop="username" style="margin-top: 10px">
              <el-col :span="20">
                  <!-- v-on:mouseleave.native="handleMouseleave()"   -->
                <el-input
                  placeholder="请输入账号"
                  @blur="checkUsername"
                  class="inps"
                  v-model="ruleForm.username">
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="姓名" prop="name" style="margin-top: 10px">
              <el-col :span="20">
                <el-input  placeholder="请输入姓名"   class="inps" v-model="ruleForm.name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="margin-top: 10px">
              <el-col :span="20">
                  <el-input
                    placeholder="请输入邮箱"
                    class="inps"
                    @blur="checkEmail"
                    v-model="ruleForm.email">
                  </el-input>
              </el-col>
            </el-form-item>
           <el-form-item label="验证码" prop="emailCode" style="margin-top: 10px">
              <el-col :span="20">
                <el-input
                  placeholder="请输入邮箱验证码"
                  class="inps"
                  @blur="verifyEmailCodeBlur"
                  v-model="ruleForm.emailCode">
                   <el-button slot="append" @click="sendCode()" :disabled="isDisabled">
                    {{this.content}}
                  </el-button>
                  </el-input>
              </el-col>
            </el-form-item>
            <el-form-item style="margin-top: 20px;margin-left:-70px; ">
              <el-button type="primary" class="submitBtn" @click="registerSubmit()">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>
</template>

<script>
    import { Message } from 'element-ui'
    import Particles from '@/components/particles/index'
    import {findByUserName,findByEmail,saveUser,sendEmailCode,verifyEmailCode} from '@/api/register'
    export default {
        components: {Particles},
        name: "Register",
        data() {
            return {
                ruleForm: {
                    username: '',
                    name:'',
                    email:'',
                    emailCode:'',
                },
                labelPosition: 'right',
                content:'获取验证码',
                second: 60,
                isDisabled: false,
                rules: {
                    username: [
                        {required: true, message: '请输入胡用户名！', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'},
                    ],
                    name: [
                      {required: true,message: '请输入姓名!', trigger: 'blur'}
                    ],
                    email: [
                      {required: true,message: '请输入邮箱!', trigger: 'blur'},
                      { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
                    ],
                    emailCode:[
                      {required: true,message: '请输入邮箱验证码!', trigger: 'blur'}
                    ]

                }
            };
        },

        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //检查账号是否存在
            async checkUsername() {
               if(this.ruleForm.username == "" || this.ruleForm.username == null || this.ruleForm.username == undefined){
                    return;
                }
                const res = await findByUserName(this.ruleForm.username);
                console.log(res.data);
                if (res.data != "" && res.data != null) {
                    this.$message({
                        type: 'success',
                        message: '该账号已存在'
                    });
                }
            },
            //检查邮箱是否存在
            async checkEmail(){
                //根据邮箱查询
                if(this.ruleForm.email == "" || this.ruleForm.email == null || this.ruleForm.email == undefined){
                    return;
                }
                const res = await findByEmail(this.ruleForm.email);
                if (res.data != "" && res.data != null) {
                    this.$message({
                        type: 'success',
                        message: '该邮箱已被注册'
                    });
                }

            },
            //注册用户
            async registerSubmit(){
              console.log(this.ruleForm);
                const res = await saveUser(this.ruleForm);
                if (res.data != "" && res.data != null) {
                    this.$message({
                        type: 'success',
                        message: '注册成功'
                    });
                    //注册成功跳转到登录页
                    this.$router.push("/login");
                }else{
                    this.$message({
                        type: 'failure',
                        message: '注册失败'
                    });
                }
            },
            //发送邮箱验证码
           async sendCode(){
                if(this.ruleForm.email == "" || this.ruleForm.email == null || this.ruleForm.email == undefined){
                  this.$message({
                        message: '邮箱不能为空'
                    });
                    return;
                }
                this.content = "重新获取"+this.second + "s";
                let clock = window.setInterval(() => {
                      this.second--;
                      this.content = "重新获取"+this.second + "s";
                      this.isDisabled = true;
                      if (this.second < 1) {
                          //当倒计时小于0时清除定时器
                          window.clearInterval(clock); //关闭
                          this.second = 60;
                          this.content = "获取验证码";
                          this.isDisabled = false;
                      }
                }, 1000);
                await sendEmailCode(this.ruleForm.email).then(async(response) => {
                  if (response.code === 200){
                    console.log(response.data);
                    if (response.data != "" && response.data != null) {
                        Message({
                        message: "发送成功",
                        type: 'success',
                        duration: 1000
                      })
                    }
                  }else if(response.code === 508){
                    Message({
                      message: response.message,
                      type: 'failure',
                      duration: 1000
                    })
                  }else{
                    Message({
                      message: "服务器错误",
                      type: 'error',
                      duration: 1000
                    })
                  }
                });
            },
            //验证邮箱验证码
            verifyEmailCodeBlur(){
                console.log(this.ruleForm.email+","+this.ruleForm.emailCode);
                verifyEmailCode(this.ruleForm.email,this.ruleForm.emailCode).then(async(response) => {
                    if (response.code === 200){
                        if (response.data == false) {
                            Message({
                                message: "验证码错误",
                                type: 'error',
                                duration: 1000
                            })
                            this.ruleForm.emailCode = '';
                        }
                    } else {
                        Message({
                            message: "服务器错误",
                            type: 'error',
                            duration: 1000
                        })
                    }
                });
            }

        }
    }


</script>

<style scoped>
  .register {

    padding: 0;
    margin: 0;
    height: 100vh;
    font-size: 16px;
    background-position: left top;

    color: #fff;
    font-family: "Source Sans Pro";
    position: relative;
  }

  .myRegister {
    /* width: 240px;
    height: 280px; */
    width: 400px;
    height: 350px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(
        230deg,
        rgba(53, 57, 74, 0) 0%,
        rgb(0, 0, 0) 100%
    );
  }

  .inps input {
    border: none;
    color: #fff;
    background-color: transparent;
    font-size: 12px;
  }

  .submitBtn {
    margin: 0 0 0 0;
    background-color: transparent;
    color: #39f;
    width: 200px;
  }

</style>

