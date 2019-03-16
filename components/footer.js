var footerHtml = `
    <div class="mint-tabbar is-fixed">
        <a class="mint-tab-item is-selected" @click="openFooter(0)" :class="{ active: isActive[0] }">
            <div class="mint-tab-item-label">
                <i class="icon iconfont">&#xe60e;</i> 
                <span>首页</span>
            </div>
        </a> 
        
        <a class="mint-tab-item is-selected" @click="openFooter(1)" :class="{ active: isActive[1] }">
            <div class="mint-tab-item-label">
                <i class="icon iconfont">&#xe61f;</i> 
                <span>发现</span>
            </div>
        </a> 
        
        <a class="mint-tab-item is-selected" @click="openFooter(2)" :class="{ active: isActive[2] }">
            <div class="mint-tab-item-label">
                <i class="icon iconfont">&#xe663;</i> 
                <span>VIP专区</span>
            </div>
        </a> 
        
        <a class="mint-tab-item is-selected" @click="openFooter(3)" :class="{ active: isActive[3] }">
            <div class="mint-tab-item-label">
                <i class="icon iconfont">&#xe628;</i> 
                <span>线上圈存</span>
            </div>
        </a> 
        
        <a class="mint-tab-item is-selected" @click="openFooter(4)" :class="{ active: isActive[4] }">
            <div class="mint-tab-item-label">
                <i class="icon iconfont">&#xe613;</i> 
                <span>我的</span>
            </div>
        </a>
    </div>
`