var editEmailHtml = `
    <div class="edit-item editemail-item" :class="{active: isShowEmail}">
        <input placeholder="请输入新邮箱" class="inputchange" v-on:input="watchEmail" v-model="newEmail"></input>
        <div class="button">
            <button @click="cancel">取消</button>
            <button @click="changeEmail" :disabled="isEmailCanSubmit">确定</button>
        </div>
    </div>`;

    var emailComponent = Vue.extend({
        template: editEmailHtml,
        props: ['isShowEmail','newEmail','isEmailCanSubmit'],       
        methods: {
            watchEmail: function(){
                this.isEmailCanSubmit = zValidate.email(this.newEmail) ? false : true;
            },

            changeEmail: function(){
                var input = {
                    emailAddress: this.newEmail
                };
                this.$indicator.open();
                this.isEmailCanSubmit = true;
                commonAjax(this,'/api/services/app/MyProfile/UpdateMySetting','put',input,this.submitSuccess,this.submitError);
            },

            submitSuccess: function(data){
                this.$indicator.close();
                this.isEmailCanSubmit = false;
                if(data.data.success){
                    app.mySetting.emailAddress = this.newEmail;
                    this.$toast('修改邮箱成功');
                    this.cancel();
                }else{
                    this.$toast('操作失败，请重试');
                }
            },

            submitError: function(err){
                this.isEmailCanSubmit = false;
                this.$indicator.close();
                this.$toast(err.body.error.message);
            },

            cancel: function(){
                app.showEditsetting = false;
                app.isShowEmail = false;
            }
        }
    });
    Vue.component('email-component', emailComponent);