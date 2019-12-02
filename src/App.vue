<template>
    <div id="app">
        <headTop></headTop>

        <div class="main">
            <router-view :key="$route.fullPath" />
        </div>
        <footBottom></footBottom>
        <div class="scroll-box" v-if="isShow" v-on:click="goTop()">
            <img src="./assets/image/top.png" alt />
        </div>
    </div>
</template>

<script>
import headTop from "@/components/header";
import footBottom from "@/components/footer";
import transactionsVue from "./pages/searchinfo/transactions.vue";
export default {
    name: "App",
    data() {
        return {
            scrollTop: 0,
            windowHeight: 0,
            isShow: false
        };
    },
    components: {
        headTop,
        footBottom
    },
    watch: {
        $route(to, from) {
            this.goTop();
        }
    },
    mounted() {
        this.scrollTop = document.querySelector("#app").scrollTop;
        this.windowHeight = document.body.clientHeight;
        document
            .querySelector("#app")
            .addEventListener("scroll", this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.scrollTop = document.querySelector("#app").scrollTop;
            if (this.scrollTop > 200) {
                this.isShow = true;
            } else {
                this.isShow = false;
            }
        },
        goTop() {
            document.querySelector("#app").scrollTop = 0;
        }
    }
};
</script>

<style>
body,
html {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: #f0f0f0;
}
* {
    margin: 0;
    padding: 0;
    -webkit-overflow-scrolling: touch;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 14px;
    background: #f0f0f0;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.header {
    height: 140px;
}
.footer {
    height: 60px;
}
.main {
    width: 1000px;
    min-height: calc(100% - 200px);
    margin: 0 auto;
    padding-top: 20px;
}
ul,
li,
ol {
    list-style: none;
}
.scroll-box {
    display: none;
    position: absolute;
    z-index: 999;
    bottom: 40px;
    right: 10px;
    width: 40px;
    height: 40px;
    overflow: hidden;
}
.scroll-box img {
    width: 100%;
    height: 100%;
}

.el-pagination.is-background .el-pager li:not(.disabled).active,
.el-pagination.is-background .el-pager li:not(.disabled):hover {
    background-color: #00b000;
}

@media screen and (max-width: 960px) {
    .main {
        width: 100%;
    }
    .scroll-box {
        display: block;
    }
}
</style>
