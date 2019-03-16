var editNickNameHtml = `
    <div class="edit-item editnickname-item" :class="{active: isShowNickName}">
        <input placeholder="请输入昵称" class="inputchange" v-on:input="watchEditNickName" v-model="nickName"></input>
        <div class="button">
            <button @click="cancel">取消</button>
            <button @click="editNickName" :disabled="isEditNickNameOk">确定</button>
        </div>
    </div>`;

    var nickNameComponent = Vue.extend({
        template: editNickNameHtml,
        props: ['nickName','isEditNickNameOk','isShowNickName'],
        methods: {
            watchEditNickName: function(){
                this.isEditNickNameOk = this.nickName ? false : true;
            },

            editNickName: function(){
                var input = {
                    nickName: this.nickName
                };
                this.$indicator.open();
                this.isEditNickNameOk = true;
                commonAjax(this,'/api/services/app/MyProfile/UpdateMySetting','put',input,this.editNickNameSuccess,this.editNickNameError);
            },

            editNickNameSuccess: function(data){
                if(data.data.success){
                    app.mySetting.nickName = this.nickName;
                    this.$toast('修改昵称成功');
                    this.nickName = '';
                    this.$indicator.close();
                    this.cancel();
                }
            },

            editNickNameError: function(err){
                console.log(err);
                this.$indicator.close();
                this.$toast(err.body.error.message);
            },

            cancel: function(){
                app.showEditsetting = false;
                app.isShowNickName = false;
            }
        }
    });
    Vue.component('nick-name-component', nickNameComponent);