var editPhoneNumberHtml = `
    <div class="edit-item editphone-item" :class="{active: isShowPhoneNumber, two: isTwoStep}">
        <div id="oldphone-item" v-show="showOldPhone">
            <div class="phonecode-item">
                <input placeholder="请输入验证码" class="inputchange" v-on:input="watchPhoneCode" v-model="oldPhoneCode"></input>
                <span class="getcode" id="getoldcode" @click="getcode($event,0)">获取验证码</span>
            </div>
            <div class="button">
                <button @click="cancel">取消</button>
                <button @click="editPhoneCode" :disabled="isEditOldPhoneOk">确定</button>
            </div>
        </div>
        <div id="newphone-item" v-show="!showOldPhone">
            <input placeholder="请输入新手机号" class="inputchange" style="margin-bottom:1.5rem;" v-on:input="watchNewPhone" v-model="newPhoneNumber"></input>
            <div class="phonecode-item">
                <input placeholder="请输入验证码" class="inputchange" v-on:input="watchNewPhoneCode" v-model="newPhoneCode"></input>
                <span class="getcode" id="getnewcode" @click="getcode($event,1)">获取验证码</span>
            </div>
            <div class="button">
                <button @click="cancel">取消</button>
                <button @click="changeNewPhone" :disabled="isNewPhoneCanSubmit">确定</button>
            </div>
        </div>
    </div>`;

    var phoneNumberComponent = Vue.extend({
        template: editPhoneNumberHtml,
        props: ['showOldPhone','oldPhoneCode','isEditOldPhoneOk','newPhoneNumber','newPhoneCode','isNewPhoneCanSubmit','isShowPhoneNumber','isTwoStep'],
        data: {
            isTwoStep: false
        },
        methods: {
            getcode: function(e, type){
                if(type == 1){
                    if(!zValidate.phone(this.newPhoneNumber)){
                        this.$toast('手机号码格式不正确');
                        return false;
                    }
                }
                if(this.getphonecodestatus){
                    this.sendPhoneCode(e.target, type);
                }else{
                    let name = e.target.className.split(' ');
                    if(name.indexOf('loading') == -1){
                        this.getphonecodestatus = true;
                        this.sendPhoneCode(e.target, type);
                    }
                }
            },

            sendPhoneCode: function(obj, type){
                var status = getPhoneCodeNow(obj, 60 ,true,'获取验证码','重新发送');
                this.getphonecodestatus = status;
                this.SendSmsCode('/api/services/app/SMS/SendSmsCode', type);
            },

            SendSmsCode: function(apiUrl, index){
                var userId = JSON.parse(getCookie('user')).userId;
                var phoneNumber = '';
                var type = 6;
                if(index == 1){
                    phoneNumber = this.newPhoneNumber;
                    type = 7;
                    userId = '';
                }
                var input = {
                    phoneNumber: phoneNumber,
                    userId: userId,
                    type: type
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
                this.isEditOldPhoneOk = (this.oldPhoneCode.length == 6) ? true : false;
            },

            editPhoneCode: function(){
                var input = {
                    phoneNumberCode: this.oldPhoneCode
                };
                commonAjax(this,'/api/services/app/MyProfile/ValidateMyPhoneNumber','post',input,this.oldSuccess,this.oldError);
            },

            oldSuccess: function(data){
                if(data.data.success){
                    this.isTwoStep = true;
                    this.showOldPhone = false;
                    var obj = document.getElementById('getoldcode');
                    getPhoneCodeNow(obj, 0 ,true,'获取验证码','重新发送', 'off');
                }else{
                    this.$toast('操作失败，请重试');
                }
            },

            oldError: function(err){
                this.$toast(err.body.error.message);
            },

            watchNewPhone: function(){
                this.isNewPhoneNumberOk = zValidate.phone(this.newPhoneNumber) ? true : false;
                this.watchNewPhoneForm();
            },

            watchNewPhoneCode: function(){
                this.isNewPhoneCodeOk = (this.newPhoneCode.length == 6) ? true : false;
                this.watchNewPhoneForm();
            },

            watchNewPhoneForm: function(){
                if(this.isNewPhoneNumberOk && this.isNewPhoneCodeOk){
                    this.isNewPhoneCanSubmit = false;
                }else{
                    this.isNewPhoneCanSubmit = true;
                }
            },

            changeNewPhone: function(){
                var input = {
                    phoneNumber: this.newPhoneNumber,
                    phoneNumberCode: this.newPhoneCode
                };
                this.$indicator.open();
                this.isNewPhoneCanSubmit = true;
                commonAjax(this,'/api/services/app/MyProfile/ChangePhoneNumber','post',input,this.newSuccess,this.newError);
            },

            newSuccess: function(data){
                this.$indicator.close();
                this.isNewPhoneCanSubmit = false;
                if(data.data.success){
                    app.mySetting.phoneNumber = this.newPhoneNumber;
                    this.$toast('修改手机号成功');
                    this.cancel();
                }else{
                    this.$toast('操作失败，请重试');
                }
            },

            newError: function(err){
                this.isNewPhoneCanSubmit = false;
                this.$indicator.close();
                this.$toast(err.body.error.message);
            },

            cancel: function(){
                app.showEditsetting = false;
                app.isShowNickName = false;
                this.isTwoStep = false;
            }
        }
    });
    Vue.component('phone-number-component', phoneNumberComponent);