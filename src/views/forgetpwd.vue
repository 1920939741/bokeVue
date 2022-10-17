<script src="../main.js"></script>
<Particles></Particles>
<template>
    <div>
      <Particles></Particles>
      <div class="forgetpwe">
        <div class="myForgetpwe" align="center" v-show="sendemailDiv">
          <h4>boke帐号安全验证</h4>
          <div>
            <h5>为确认身份，我们仍需验证您的安全邮箱</h5>
            <p>点击发送邮件按钮，将会发送一封有验证码的邮件至邮箱</p>
            <p>{{this.$route.query.eamil.replace(this.$route.query.eamil.substring(3,this.$route.query.eamil.lastIndexOf("@")),"***")}}</p>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
            <!-- <el-form-item label="邮箱" prop="email" style="margin-top: 10px">
              <el-row>
                <el-col :span="22">
                    <el-input
                      placeholder="请输入邮箱"
                      class="inps"
                      v-model="ruleForm.email">
                    </el-input>
                </el-col>
              </el-row>
            </el-form-item> -->
            <el-form-item style="margin-top: 30px;margin-left:-70px">
              <el-button type="primary" class="submitBtn" @click="sendEmail()">发送邮箱</el-button>
            </el-form-item>
          </el-form>
        </div>


      <div class="myForgetpEmail" align="center" v-show="emailConfirm">
          <h4>boke帐号安全验证</h4>
          <div>
            <p>请使用安全邮箱{{this.$route.query.eamil.replace(this.$route.query.eamil.substring(3,this.$route.query.eamil.lastIndexOf("@")),"***")}}获取验证码</p>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
            <el-form-item label="" prop="eamilCode" style="margin-top: 10px;">
                 <el-input  placeholder="请输入邮箱验证码"   class="email-input" @blur="verifyEmailCodeBlur" v-model="ruleForm.eamilCode">
                    <el-button slot="append" @click="sendEmail()" :disabled="isDisabled">{{this.content}}</el-button>
                 </el-input>
            </el-form-item>
            <el-form-item style="margin-top: 30px">
              <el-button type="primary" class="submitBtn" @click="submitCode()">确定</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改密码':'重置密码'" width="550px">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newPassword">
              <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item>
            <el-button type="primary" @click="submitFormPwd('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- <div style="text-align:right;">
            <el-button type="danger" @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmPwd">确定</el-button>
          </div> -->
    </el-dialog>
      </div>
    </div>


</template>

<script>
    import { Message } from 'element-ui'
    import Particles from '@/components/particles/index'
    import {sendEmailCode,verifyEmailCode,updatePassword} from '@/api/register'
    export default {
        components: {Particles},
        name: "Login",
        data() {
            var validatePwd = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入密码'));
                } else {
                  if (this.ruleForm.newPassword !== '') {
                    this.$refs.ruleForm.validateField('newPassword');
                  }
                  callback();
                }
              };
              var validateNewPwd = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
            };
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    newPassword:'',
                    email:'',
                    eamilCode:'',
                },
                second:60,
                canClick: true,
                emailConfirm: false,
                sendemailDiv: true,
                dialogVisible: false,
                dialogType: 'new',
                content:'发送验证码',
                isDisabled: false,
                rules: {
                    username: [
                        {required: true, message: '请输入胡用户名！', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    password: [
                         { validator: validatePwd, trigger: 'blur' }
                    ],
                     newPassword: [
                        { validator: validateNewPwd, trigger: 'blur' }
                    ],
                    email: [
                      {required: true,message: '请输入邮箱!', trigger: 'blur'},
                      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    eamilCode:[
                        {required: true, message: '请输入验证码！', trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            async sendEmail(){
                this.sendemailDiv = false;
                this.emailConfirm = true;
                this.content = "重新发送"+this.second + "s";
                let clock = window.setInterval(() => {
                    this.second--;
                    this.content = "重新发送"+this.second + "s";
                    this.isDisabled = true;
                    if (this.second < 0) {
                        //当倒计时小于0时清除定时器
                        window.clearInterval(clock); //关闭
                        this.second = 60;
                        this.content = "发送验证码";
                        this.isDisabled = false;
                    }
             }, 1000);

             await sendEmailCode(this.$route.query.eamil).then(async(response) => {
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

            },
            submitCode(){
                verifyEmailCode(this.$route.query.eamil,this.ruleForm.eamilCode).then(async(response) => {
                    if (response.code === 200){
                        if (response.data == false) {
                            Message({
                                message: "验证码错误",
                                type: 'error',
                                duration: 1000
                            })
                            this.ruleForm.eamilCode = '';
                        }else{
                            this.dialogVisible = true;
                            this.dialogType = 'new'
                        }
                    } else {
                        Message({
                            message: "服务器错误",
                            type: 'error',
                            duration: 1000
                        })
                    }
                });
            },
            confirmPwd(){

            },
            submitFormPwd(formName) {
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.dialogVisible = false;
                  console.log(this.ruleForm);
                  updatePassword(this.$route.query.eamil,this.ruleForm.password,this.ruleForm.newPassword).then(async(response)=>{
                    if (response.code === 200){
                        if (response.data > 0) {
                            Message({
                                message: "修改成功",
                                type: 'success',
                                duration: 1000
                            })
                            this.ruleForm.eamilCode = '';
                        }else {
                            Message({
                                message: "修改失败",
                                duration: 1000
                            })
                        }
                    } else {
                        Message({
                            message: "服务器错误",
                            type: 'error',
                            duration: 1000
                        })
                    }
                  });
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });

            },
            resetForm(formName) {
              this.$refs[formName].resetFields();
            }
        }
    }


</script>

<style scoped>
  .forgetpwe {

    padding: 0;
    margin: 0;
    height: 100vh;
    font-size: 16px;
    background-position: left top;

    color: #fff;
    font-family: "Source Sans Pro";
    position: relative;
  }

  .myForgetpwe,.myForgetpEmail {
    width: 450px;
    height: 300px;
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
  /* .email-input{
    width: 320px;
  } */
  .inps input {
    border: none;
    color: #fff;
    background-color: transparent;
    font-size: 12px;
  }

  .submitBtn {
    background-color: transparent;
    color: #39f;
    width: 200px;
  }

</style>

