var editPassWordHtml = `
    <div class="edit-item editpassword-item" :class="{active: isShowPassWord}">
        <div class="phonecode-item">
            <input placeholder="请输入验证码" class="inputchange" v-on:input="watchPhoneCode" v-model="passWordPhoneCode"></input>
            <span class="getcode" @click="getcode($event)">获取验证码</span>
        </div>
        <input placeholder="请输入8-20位数字与字母组合密码" class="inputchange" style="margin-top:1.5rem;" v-on:input="watchPassWord" type="password" v-model="newPassWord"></input>
        <input placeholder="请再输入一次新密码" class="inputchange" style="margin-top:1.5rem;" v-on:input="watchConfirmPassWord" type="password" v-model="newConfirmPassWord"></input>
        <div class="button">
            <button @click="cancel">取消</button>
            <button @click="changePassWord" :disabled="isPassWordCanSubmit">确定</button>
        </div>
    </div>`;

    var passWordComponent = Vue.extend({
        template: editPassWordHtml,
        props: ['isShowPassWord','passWordPhoneCode','newPassWord','newConfirmPassWord','isPassWordCanSubmit'],       
        methods: {
            getcode: function(e){
                if(this.getphonecodestatus){
                    this.sendPhoneCode(e.target);
                }else{
                    let name = e.target.className.split(' ');
                    if(name.indexOf('loading') == -1){
                        this.getphonecodestatus = true;
                        this.sendPhoneCode(e.target);
                    }
                }
            },

            sendPhoneCode: function(obj){
                var status = getPhoneCodeNow(obj, 60 ,true,'获取验证码','重新发送');
                this.getphonecodestatus = status;
                this.SendSmsCode('/api/services/app/SMS/SendSmsCode');
            },

            SendSmsCode: function(apiUrl){
                var input = {
                    phoneNumber: '',
                    userId: JSON.parse(getCookie('user')).userId,
                    type: 5
                }
                this.$indicator.open();
                commonAjax(this,apiUrl,'post',input,this.getSmsCodeSuccess,this.getSmsCodeError);
            },

            getSmsCodeSuccess: function(data){
                this.$indicator.close();
                this.$toast('验证码已经发送');
            },

            getSmsCodeError: function(err){
                this.$indicator.close();
            },

            watchPhoneCode: function(){
                this.isPassWordPhoneCodeOk = (this.passWordPhoneCode.length == 6) ? true : false;
                this.watchNewPassWordForm();
            },

            watchPassWord: function(){
                this.isNewPassWordOk = zValidate.password(this.newPassWord) ? true : false;
                this.watchNewPassWordForm();
            },

            watchConfirmPassWord: function(){
                this.isNewConfirmPassWordOk = zValidate.password(this.newConfirmPassWord) ? true : false;
                this.watchNewPassWordForm();
            },

            watchNewPassWordForm: function(){
                console.log()
                if(this.isPassWordPhoneCodeOk && this.isNewPassWordOk && this.isNewConfirmPassWordOk){
                    if(this.newConfirmPassWord != this.newPassWord){
                        this.isPassWordCanSubmit = true;
                        this.$toast('两次输入密码不相同');
                    }else{
                        this.isPassWordCanSubmit = false;
                    }
                }else{
                    this.isPassWordCanSubmit = true;
                }
            },

            changePassWord: function(){
                var input = {
                    phoneNumberCode: this.passWordPhoneCode,
                    password: this.newPassWord,
                    confirmPassword: this.newConfirmPassWord
                };
                this.$indicator.open();
                this.isPassWordCanSubmit = true;
                commonAjax(this,'/api/services/app/MyProfile/ChangePassword','post',input,this.changePwSuccess,this.changePwError);
            },

            changePwSuccess: function(data){
                this.$indicator.close();
                if(data.data.success){
                    this.$toast('修改密码成功');
                    this.cancel();
                }
            },

            changePwError: function(){
                this.isPassWordCanSubmit = false;
                this.$indicator.close();
                this.$toast(err.body.error.message);
            },

            cancel: function(){
                app.showEditsetting = false;
                app.isShowPassWord = false;
            }
        }
    });
    Vue.component('pass-word-component', passWordComponent);