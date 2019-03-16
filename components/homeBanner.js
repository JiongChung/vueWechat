var homeBannerHtml = `
    <mt-swipe :style="{ height: bannerHeight + 'px' }" :auto="4000">
        <mt-swipe-item v-for="(item, index) in bannerList">
            <img :src="item.picture" :alt="item.title" @click="clickImage(index)">
        </mt-swipe-item>
    </mt-swipe>
`