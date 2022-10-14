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
                  v-model="ruleForm.emailCode">
                   <el-button slot="append" @click="sendEmailCode()"><template>{{this.content}}</template></el-button>
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
    import Particles from '@/components/particles/index'
    import {findByUserName,findByEmail,saveUser,sendEmailCode} from '@/api/register'
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
           async sendEmailCode(){
                this.content = "重新获取"+this.second + "s";
                let clock = window.setInterval(() => {
                      this.second--;
                      this.content = "重新获取"+this.second + "s";
                      if (this.second < 1) {
                          //当倒计时小于0时清除定时器
                          window.clearInterval(clock); //关闭
                          this.second = 60;
                          this.content = "获取验证码";
                      }
                }, 1000);
                //todo
                //const res =await sendEmailCode(this.ruleForm.email);

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

