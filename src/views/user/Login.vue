<template>
  <div class="main">
    <div class="box">
      <div class="left">
        <div>
          <div class="logo">
            <img src="../../assets/logo.png" alt=""  />
          </div>
          <div class="title">数字化能碳管理中心软件平台</div>
        </div>
      </div>
      <div class="right">
        <div class="right-top">
          欢迎使用本系统
        </div>
        <div class="right-contont">
          <div class="contont-top">
            账户密码登录
            <div class="tab"></div>
          </div>
          <div>
            <a-form-model ref="form" :model="model" :rules="validatorRules">
              <a-form-model-item prop="username" required>
                <a-input
                  size="large"
                  v-model="model.username"
                  placeholder="请输入您的账号"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="password" required>
                <a-input
                  v-model="model.password"
                  size="large"
                  type="password"
                  autocomplete="false"
                  placeholder="请输入密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-model-item>
              <a-row :gutter="3">
                <a-col :span="14">
                  <a-form-model-item prop="inputCode" required>
                    <a-input
                      v-model="model.inputCode"
                      size="large"
                      type="text"
                      placeholder="请输入验证码"
                    >
                      <a-icon
                        slot="prefix"
                        type="smile"
                        :style="{ color: 'rgba(0,0,0,.25)' }"
                      />
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6" style="text-align: right">
                  <div
                    v-if="requestCodeSuccess"
                    style="width: 110px;
                    height: 40px;background: #F0F1F5;
                    border-radius: 4px 4px 4px 4px;
                    "
                  >
                    <img
                      style="margin-top: 2px;"
                      :src="randCodeImage"
                      @click="handleChangeCheckCode"
                    />
                  </div>
                  <div
                    v-else
                    style="width: 110px;
                    height: 40px;background: #F0F1F5;
                    border-radius: 4px 4px 4px 4px;
                    "
                  >
                    <img
                      style="margin-top: 2px;"
                      src="../../assets/checkcode.png"
                      @click="handleChangeCheckCode"
                    />
                  </div>
                </a-col>
              </a-row>
              <a-form-model-item>
                <a-checkbox
                  @change="handleRememberMeChange"
                  style="color: rgba(255,255,255,0.75);"
                  default-checked
                  >自动登录</a-checkbox
                >
              </a-form-model-item>
              <a-form-model-item>
                <!-- <div class="contant-login" @click="handleLogin" :loading="loginBtn">
                  <div class="title" :disabled="loginBtn">登录</div>
                </div> -->
                <a-button
                  class="contant-login"
                  type="primary"
                  @click="handleLogin"
                  :loading="loginBtn"
                >
                  登录
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAction } from "@/api/manage";
import Vue from "vue";
import { timeFix } from "@/utils/util";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      requestCodeSuccess: false,
      randCodeImage: "", //验证码图片
      currdatetime: "", //当前时间
      loginBtn: false, //登录
      rememberMe: true, //是否自动登录
      model: {
        username: "admin",
        password: "123456",
        inputCode: "",
      },
      validatorRules: {
        username: [
          { required: true, message: "请输入用户名!", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码!",
            trigger: "blur",
          },
        ],
        inputCode: [
          {
            required: true,
            message: "请输入验证码!",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  created() {
    this.handleChangeCheckCode();
  },
  methods: {
    ...mapActions(["Login"]),
    /**刷新验证码*/
    handleChangeCheckCode() {
      this.currdatetime = new Date().getTime();
      this.model.inputCode = "";
      getAction(`/sys/randomImage/${this.currdatetime}`)
        .then((res) => {
          if (res.success) {
            this.randCodeImage = res.result;
            this.requestCodeSuccess = true;
          } else {
            this.$message.error(res.message);
            this.requestCodeSuccess = false;
          }
        })
        .catch(() => {
          this.requestCodeSuccess = false;
        });
    },
    //账号密码登录
    handleLogin() {
      this.validateFields(["username", "password", "inputCode"], (err) => {
        if (!err) {
          let loginParams = {
            username: this.model.username,
            password: this.model.password,
            captcha: this.model.inputCode,
            checkKey: this.currdatetime,
            remember_me: this.rememberMe,
          };
          console.log("登录参数", loginParams);

          this.loginBtn = true;
          this.Login(loginParams)
            .then((res) => {
              this.loginBtn = false;

              this.$router.push({ path: "/dashboard/analysis" }).catch(() => {
                console.log("登录跳转首页出错,这个错误从哪里来的");
              });
              this.$notification.success({
                message: "欢迎",
                description: `${timeFix()}，欢迎回来`,
              });
            })
            .catch((err) => {
              this.loginBtn = false;
              //update-begin-author: taoyan date:20220425 for: 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变 #41
              if (err && err.code === 412) {
                this.handleChangeCheckCode();

                this.$message.error('验证码错误');
              }
              //update-end-author: taoyan date:20220425 for: 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变 #41
            });
        } else {
          this.loginBtn = false;
        }
      });
    },

    /**
     * 验证字段
     * @param arr
     * @param callback
     */
    validateFields(arr, callback) {
      let promiseArray = [];
      for (let item of arr) {
        let p = new Promise((resolve, reject) => {
          this.$refs["form"].validateField(item, (err) => {
            if (!err) {
              resolve();
            } else {
              reject(err);
            }
          });
        });
        promiseArray.push(p);
      }
      Promise.all(promiseArray)
        .then(() => {
          callback();
        })
        .catch((err) => {
          callback(err);
        });
    },
    handleRememberMeChange(e) {
      this.rememberMe = e.target.checked;
    },
  },
};
</script>

<style scoped lang="less">
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-image: url(../../assets/背景.png);
  background-repeat: no-repeat;
  .left {
    margin: 350px 0 0 160px;
    .logo {
      margin:  0 206px 58px 206px;
      width: 415px;
      height: 130px;
      img{
        width: 550px;
      }
    }
    .title {
      font-family: DINBold;
      font-weight: 400;
      font-size: 72px;
      color: #ffffff;
      line-height: 100px;
    }
  }
  .right {
    width: 647px;

    background: #006a77;
    border-radius: 0px 8px 8px 0px;
    .right-top {
      margin: 342px 163px 32px 180px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      font-weight: normal;
      font-size: 40px;
      color: #ffffff;
    }
    .right-contont {
      width: 269px;
      height: 302px;
      margin: 0px 189px 259px 189px;
      .contont-top {
        width: 84px;
        height: 20px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        /* font-size: 14px; */
        color: #ffffff;
        line-height: 16px;
        margin: 0 93px 25px;
        .tab {
          width: 29px;
          height: 3px;
          background: #ffffff;
          border-radius: 2px 2px 2px 2px;
          margin: 6px 27px;
        }
      }
      .contant-login {
        width: 241px;
        height: 40px;
        margin: 0 14px;
        background: #00ada3;
        border-radius: 4px 4px 4px 4px;
        cursor: pointer;
        .title {
          margin: 10px 104px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
