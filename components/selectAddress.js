var selectAddressHtml = `
    <div class="address-item-box" :class="{show: isShowAddressItem}">
        <div class="address-main-box">
            <div class="title">请选择 <span @click="cancel"><i class="icon iconfont">&#xe650;</i></span></div>
            <div class="hasselect-item">
                <ul>
                    <li v-show="addressIds.isProvince" @click="reSelect('isProvince')" :class="{active: addressIds.isProvinceOk}">{{addressIds.provinceText}}</li>
                    <li v-show="addressIds.isCity" @click="reSelect('isCity')" :class="{active: addressIds.isCityOk}">{{addressIds.cityText}}</li>
                    <li v-show="addressIds.isDstrict" @click="reSelect('isDstrict')"  :class="{active: addressIds.isDstrictOk}">{{addressIds.countryText}}</li>
                </ul>
            </div>
            <div class="address-list-item" id="address-list-box">
                <ul id="address-list-ul">
                    <li v-for="(item, index) in addressList.list" @click="selectItem(item.id, item.name)" :id="'item_'+item.id" :class="tabClass(item)">
                        {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
    </div>`;

    var selectAddressComponent = Vue.extend({
        template: selectAddressHtml,
        props: ['isShowAddressItem','addressList','addressIds'],
        data: {
            currentValue: ''
        },
        methods: {
            selectItem: function(id, name){
                var Li = document.getElementById('address-list-ul').getElementsByTagName('li');
                for(var i=0; i<Li.length; i++){
                    Li[i].classList.remove('active');
                }
                this.currentValue = id;
                for(var i=0; i<this.addressList.province.length; i++){
                    if(id == this.addressList.province[i].id){
                        this.addressList.list = this.addressList.province[i].sub;
                        this.addressList.city = this.addressList.province[i].sub;
                        this.addressIds.provinceText = name;
                        this.addressIds.isProvinceOk = true;
                        this.addressIds.isCity = true;
                        this.addressIds.isCityOk = false;
                        this.addressIds.cityText = '请选择城市';
                        this.addressIds.provinceId = id;
                        this.addressIds.cityId = '';
                        this.addressIds.countryId = '';
                        this.addressIds.isDstrict = false;
                        if(id == '11' || id == '12' || id == '31'){
                            console.log(id)
                            this.selectItem(this.addressList.province[i].sub[0].id, this.addressList.province[i].sub[0].name);
                        }
                        break;
                    }
                }

                for(var i=0; i<this.addressList.city.length; i++){
                    if(id == this.addressList.city[i].id){
                        this.addressList.list = this.addressList.city[i].sub;
                        this.addressList.country = this.addressList.city[i].sub;
                        this.addressIds.cityText = name;
                        this.addressIds.isCityOk = true;
                        this.addressIds.isDstrict = true;
                        this.addressIds.isDstrictOk = false;
                        this.addressIds.countryText = '请选择县区';
                        this.addressIds.cityId = id;
                        this.addressIds.countryId = '';
                        break;
                    }
                }

                for(var i=0; i<this.addressList.country.length; i++){
                    if(id == this.addressList.country[i].id){
                        this.addressIds.countryText = name;
                        this.addressIds.isDstrict = true;
                        this.addressIds.isDstrictOk = true;
                        this.addressIds.countryId = id;
                        this.onSubmit();
                        break;
                    }
                }
                document.getElementById('address-list-box').scrollTop = 0;
            },
            reSelect: function(name){
                var id = '';
                if(name == 'isProvince'){
                    if(!this.addressIds.isProvinceOk)return;
                    this.addressList.list = this.addressList.province;
                    id = this.addressIds.provinceId;
                }else if(name == 'isCity'){
                    if(!this.addressIds.isCityOk)return;
                    for(var i=0; i<this.addressList.province.length; i++){
                        if(this.addressIds.provinceId == this.addressList.province[i].id){
                            this.addressList.list = this.addressList.province[i].sub;
                            id = this.addressIds.cityId;
                            break;
                        }
                    }
                }else{
                    if(!this.addressIds.isDstrictOk)return;
                    for(var i=0; i<this.addressList.province.length; i++){
                        if(this.addressIds.provinceId == this.addressList.province[i].id){
                           for(var j=0; j<this.addressList.province[i].sub.length; j++){
                               if(this.addressIds.cityId == this.addressList.province[i].sub[j].id){
                                    this.addressList.list = this.addressList.province[i].sub[j].sub;
                                    id = this.addressIds.countryId;
                                    break;
                               }
                           }
                            break;
                        }
                    }
                }
                
                this.$nextTick(() => {
                    var Li = document.getElementById('address-list-ul').getElementsByTagName('li');
                    for(var i=0; i<Li.length; i++){
                        Li[i].classList.remove('active');
                    }
                    document.getElementById('item_'+id).classList.add('active');
                });
            },
            tabClass: function(item){
                return [
                    {
                        'active': item.id === this.currentValue
                    }
                ]
            },
            onSubmit: function(){
                var newAddress = {};
                newAddress.districtId = this.addressIds.countryId;
                newAddress.districtName = this.addressIds.provinceText + ' ' + this.addressIds.cityText + ' ' + this.addressIds.countryText;
                this.$emit('listenaddress', newAddress);
            },
            cancel: function(){
                this.$emit('listenaddress', 'address');
            }
        }
    });
    Vue.component('select-address-component', selectAddressComponent);