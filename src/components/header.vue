<template>
    <div class="header">
        <div class="header-wrapper width1000">
            <div
                class="back-prev"
                v-on:click="goBack()"
                v-if="isHomePage && windowWidth < 1000 && hasLastPage"
            ></div>
            <div class="logo-wrapper" v-on:click="goHome()">
                <span class="logo"></span>
                <span class="text">POC</span>
                <!-- <div class="menu">v-on:click="goHome()"</div> -->
            </div>
            <div class="searchBox">
                <div class="searchbox-wrapper">
                    <em class="searchimg"></em>
                    <input
                        type="search"
                        class="searchinput"
                        v-model="inputValue"
                        placeholder="Search by Address / Txhash / Block Height"
                        @keyup.enter="keyUp"
                    />
                    <!-- <input type="search" class="searchinput" v-model="inputValue" placeholder="Search by Address / Txhash / Block Height" > -->
                    <span class="searchbtn" v-on:click="searchKey()">Search</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Loading, MessageBox, Message } from "element-ui";
export default {
    name: "headTop",
    data() {
        return {
            NumOrStr: /^[0-9]*$/,
            Address: /^poc[a-fA-F0-9]{40}$/,
            Hash: /^poc[a-fA-F0-9]{64}$/,
            inputValue: "",
            windowWidth: 0,
            isHomePage: false,
            hasLastPage: false
        };
    },
    watch: {
        $route(to, from) {
            this.$store.commit("clearData");
            this.inputValue = "";
            if (this.$route.path == "/") {
                this.isHomePage = false;
            } else {
                this.isHomePage = true;
            }
            // console.log('dddd'+window.history.length);
            if (window.history.length > 1) {
                this.hasLastPage = true;
            } else {
                this.hasLastPage = false;
            }
        }
    },
    mounted() {
        console.log("window.history.length" + window.history.length);
        if (window.history.length > 1) {
            this.hasLastPage = true;
        } else {
            this.hasLastPage = false;
        }
        const that = this;
        this.windowWidth = document.body.clientWidth;
        if (this.$route.path == "/") {
            this.isHomePage = false;
        } else {
            this.isHomePage = true;
        }
        window.onresize = function temp() {
            that.windowWidth = document.body.clientWidth;
        };
    },
    methods: {
        searchKey() {
            this.inputValue = this.inputValue.replace(/\s*/g, "");
            if (this.inputValue == "") {
                this.$toast.center("不能输入空的查询信息");
                this.inputValue = "";
                return false;
            } else if (this.NumOrStr.test(this.inputValue)) {
                this.$router.push("/block/" + this.inputValue);
            } else if (this.Hash.test(this.inputValue)) {
                this.$router.push("/txhash/" + this.inputValue);
            } else if (this.Address.test(this.inputValue)) {
                this.$router.push("/address/" + this.inputValue);
            } else {
                this.$toast.center("不能输入错误的查询信息");
                this.inputValue = "";
                return false;
            }
        },
        keyUp(e) {
            if (e.keyCode === 13) {
                this.searchKey();
            }
        },
        goBack() {
            try {
                if (this.hasLastPage == true) {
                    console.log(1234);
                    this.$router.go(-1);
                }
            } catch (e) {
                console.log(3333);
                window.close();
            }
        },
        goHome() {
            this.$router.push("/");
        },
        focusInput() {
            console.log("失去焦点");
        }
    }
};
</script>
<style scoped lang="less">
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
    display: none;
}
.header {
    width: 100%;
    height: 64px;
    background: #fff;
}
.header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}
.back-prev {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    background: url(../assets/image/back.svg) center center no-repeat;
    background-size: 21px auto;
}

.width1000 {
    width: 1000px;
    margin: 0 auto;
}

.container {
    width: 80%;
    margin: 0% 10%;
}

.logo-wrapper {
    height: 64px;
    display: block;
    cursor: pointer;
    display: flex;
    // width: 100px;
    .logo {
        background: url(../assets/image/logo.svg) left center no-repeat;
        background-size: auto 32px;
        width: 40px;
        height: 100%;
        display: block;
    }

    .text {
        color: #00b000;
        font-size: 20px;
        font-weight: 600;
        line-height: 64px;
    }
}

.searchBox {
    width: 400px;
    height: 36px;
    margin-left: 20px;
    border-radius: 4px;
    background: #f8f8f8;
    box-shadow: 1px 0 25px 0 rgba(0, 0, 0, 0.04);
    overflow: hidden;
    display: flex;

    .searchbox-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
    }
}
.searchimg {
    width: 42px;
    height: 100%;
    background: url(../assets/image/searchbtn.png) center center no-repeat;
    border-radius: 2px;
    display: block;
    background-size: 16px;
    overflow: hidden;
}
.searchinput {
    border: none;
    height: 100%;
    line-height: normal;
    flex: 1;
    text-indent: 30px;
    outline: none;
    // border-radius: 2px;
    overflow: hidden;
    text-indent: 0;
    background: #f8f8f8;
    color: #00b000;
}
.searchbtn {
    background: #00b000;
    width: 160px;
    height: 100%;
    line-height: 36px;
    display: block;
    color: #fff;
    text-align: center;
    cursor: pointer;
    width: 80px;
}
@media screen and (max-width: 999px) {
    .header {
        height: 136px;
        .header-wrapper {
            flex-direction: column;
            .logo {
                height: 100%;
                width: 30px;
                text-align: center;
                background-position-x: center;
                background-size: auto 24px;
            }

            .searchBox {
                height: 88px;
                padding: 22px 18px;
                width: 100%;
                background: #00b000;
                margin: 0;
                .searchbox-wrapper {
                    width: 100%;
                    height: 44px;
                    display: flex;
                    background: #fff;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .searchinput {
                    background: #fff;
                }
            }
        }
    }

    .title {
        text-align: center;
        text-indent: 0%;
    }
    .width1000 {
        width: 100%;
    }
    .container {
        width: 96%;
        margin: 0% 2%;
    }
    .searchbtn {
        display: none;
    }
}
</style>

