<template>
    <div class="main-page">
        <div>
            <div class="main-type">
                <h3>Transactions</h3>
                <p>For Block {{ Height }}</p>
            </div>
            <div>
                <ul class="toggle-ul">
                    <li>
                        <em></em>Overview
                    </li>
                </ul>
                <div class="toggle-div">
                    <div class="div-slide">
                        <ul>
                            <li>
                                <div>
                                    <p>Height:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(Height, '/block/')"
                                    >{{ Height }}</span>
                                </div>
                                <div>
                                    <p>TimeStamp:</p>
                                    <span>{{ TimeStamp | formatUTCAgo}} ago ({{ TimeStamp | formatUTCDate }})</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Transactions:</p>
                                    <span>{{ total }} transactions</span>
                                </div>
                                <div>
                                    <p>Hash:</p>
                                    <span>{{ Hash }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Confirmations:</p>
                                    <span>{{ Confirmations }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul class="toggle-ul">
                    <li>
                        <em></em>Transactions
                    </li>
                </ul>
                <div v-if="!isShow && boxShow">
                    <div class="toggle-div">
                        <div class="div-slide">
                            <dl v-for="item in tableData" :key="item.tx_hash">
                                <dt>
                                    <span>{{ item.timestamp | formatUTCDate }}</span>
                                </dt>
                                <dd class="fl width-mid span-Txhash">
                                    <span>Txhash:</span>
                                    <span
                                        class="fr midfr basecolor"
                                        v-on:click="goOther(item.tx_hash, '/txhash/')"
                                    >{{ item.tx_hash }}</span>
                                    <p class="line-p"></p>
                                </dd>
                                <dd class="fl width-mid span-TxFee">
                                    <span>TxFee:</span>
                                    <span
                                        class="fr midfr"
                                    >{{ item.txfee | formatNum(-18,4) }} {{ $store.state.projectName }}</span>
                                    <p class="line-p line-left"></p>
                                </dd>
                                <dd class="clearfix view-from-to">
                                    <span
                                        class="mid-wid basecolor"
                                        v-on:click="goOther(item.from, '/address/')"
                                    >
                                        {{ item.from | formatStr }}
                                        <b
                                            class="from-color"
                                        >-{{ item.value | formatNum(-18,4) }}</b>
                                    </span>
                                    <span class="center-from"></span>
                                    <span
                                        class="fr basecolor"
                                        v-on:click="goOther(item.to, '/address/')"
                                    >
                                        {{ item.to | formatStr }}
                                        <b
                                            class="to-color"
                                        >+{{ item.value | formatNum(-18,4) }}</b>
                                    </span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div class="view-see-more">
                        <div class="more-btn" v-if="isMore" v-on:click="viewLoadMore()">查看更多</div>
                        <div v-if="!isMore">没有更多数据了</div>
                    </div>
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="total"
                    ></el-pagination>
                </div>
            </div>
            <defaultPage
                v-if="isShow && boxShow"
                text="There are no matching entries"
                isShowBg="true"
            ></defaultPage>
        </div>
    </div>
</template>
<script>
import defaultPage from "@/components/default";
export default {
    name: "AddressPage",
    data() {
        return {
            isShow: false,
            boxShow: false,
            Height: "",
            pageSize: 10,
            pageIndex: 1,
            TimeStamp: "",
            Hash: "",
            Confirmations: "",
            windowWidth: 0,
            isMore: true,
            pageNum: 0
        };
    },
    components: {
        defaultPage
    },
    computed: {
        tableData() {
            return this.$store.state.tableData;
        },
        total() {
            return this.$store.state.total;
        }
    },
    mounted() {
        this.getBlock();
        this.getNewHeight();
        this.windowWidth = document.body.clientWidth;
        this.getList(this.pageIndex, this.pageSize);
    },
    methods: {
        getList(pageIndex, pageSize) {
            let that = this;
            that.Height = this.$route.params.param;
            let obj = {
                url: this.$store.state.Api.getByHeight.url,
                param: {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    height: this.$route.params.param
                },
                successCannel: function(res) {
                    that.$store.state.total = res.count;
                    that.pageNum = Math.ceil(res.count / that.pageSize);
                    that.boxShow = true;
                    if (res.transactions) {
                        if (document.body.clientWidth < 1000) {
                            for (let i = 0; i < res.transactions.length; i++) {
                                that.$store.state.tableData.push(
                                    res.transactions[i]
                                );
                            }
                        } else {
                            that.$store.state.tableData = res.transactions;
                        }
                    } else {
                        that.isShow = true;
                    }
                },
                failCannel: function(res) {
                    that.boxShow = true;
                    that.isShow = true;
                }
            };
            this.$store.commit("data", obj);
        },
        goOther(param, path) {
            this.$store.commit("clearData");
            this.$router.push({ path: path + param });
        },
        //更改每页显示条数
        handleSizeChange(val) {
            this.pageIndex = val;
            this.getList(this.pageIndex, this.pageSize);
        },
        //更改页码
        handleCurrentChange(val) {
            this.pageIndex = val;
            this.getList(this.pageIndex, this.pageSize);
        },
        viewLoadMore() {
            this.pageIndex = this.pageIndex + 1;
            if (this.pageIndex <= this.pageNum) {
                this.isMore = true;
                this.getList(this.pageIndex, this.pageSize);
            } else {
                this.isMore = false;
            }
        },
        getBlock() {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getHeight.url,
                param: {
                    height: this.$route.params.param
                },
                successCannel: function(res) {
                    console.log("查时间戳");
                    that.TimeStamp = res.timestamp;
                    that.Hash = res.hash;
                },
                failCannel: function(res) {
                    // that.Balance = res.transactions
                }
            };
            this.$store.commit("formData", obj);
        },
        getNewHeight() {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getBlockNumber.url,
                param: {},
                successCannel: function(res) {
                    console.log("查最新高度");
                    that.Confirmations =
                        res.block_number - parseInt(that.Height);
                },
                failCannel: function(res) {
                    that.Confirmations = 0;
                }
            };
            this.$store.commit("formData", obj);
        }
    }
};
</script>
<style lang="less" scoped>
@basecolor: #00b000;
.main-page {
    .main-type {
        background: #fff;
        box-shadow: 0px 0px 5px #dcdcdc;
        padding: 20px;
        h3 {
            color: #4a4a4a;
            font-weight: normal;
        }
        p {
            color: #9b9b9b;
            font-size: 12px;
        }
    }
    .toggle-ul {
        width: 100%;
        height: 44px;
        overflow: hidden;
        text-align: left;
        line-height: 44px;
        li {
            width: 100%;
            position: relative;
            float: left;
            text-indent: 5px;
            em {
                position: absolute;
                top: 15px;
                width: 2px;
                height: 12px;
                left: 0px;
                background: @basecolor;
            }
        }
    }
    .toggle-div {
        width: 100%;
        overflow: hidden;
        .div-slide {
            width: 100%;
            box-shadow: 0px 0px 5px #dcdcdc;
            ul {
                overflow: hidden;
                background: #f8f8f8;
                border-radius: 4px;
                li {
                    position: relative;
                    float: left;
                    width: 100%;
                    height: auto;
                    div {
                        height: 100%;
                        width: 50%;
                        padding: 10px;
                        float: left;
                        padding-left: 20px;
                        box-sizing: border-box;
                        p {
                            color: #9b9b9b;
                            font-size: 12px;
                            line-height: 20px;
                        }
                        span {
                            color: #4a4a4a;
                            vertical-align: middle;
                            display: inline-block;
                            word-break: break-all;
                        }
                        b {
                            color: #4a4a4a;
                            font-weight: normal;
                        }
                    }
                }
                li::before {
                    position: absolute;
                    width: 1px;
                    height: 100%;
                    background: #eee;
                    content: "";
                    left: 50%;
                }
                li:nth-child(2n + 1) {
                    background: #fff;
                }
            }
            dl {
                background: #fff;
                text-align: left;
                width: 100%;
                overflow: hidden;
                border-radius: 4px;
                box-shadow: 0px 0px 5px #dcdcdc;
                margin-bottom: 20px;
                dt,
                dd {
                    padding: 10px;
                    box-sizing: border-box;
                }
                dt {
                    border-bottom: 1px solid #ececec;
                    background: #f5f5f5;
                    overflow: hidden;
                    .fr {
                        word-break: break-all;
                        text-align: right;
                        width: calc(100% - 60px);
                    }
                }
                dd {
                    span {
                        vertical-align: middle;
                        display: inline-block;
                        white-space: pre-wrap;
                        word-break: break-all;
                        b {
                            float: right;
                            font-weight: normal;
                        }
                    }
                    span:first-child {
                        color: #9b9b9b;
                    }
                    position: relative;
                    overflow: hidden;
                    .fr {
                        width: 48%;
                        word-break: break-all;
                    }
                    .mid-wid {
                        width: 48%;
                        word-break: break-all;
                    }
                    .midfr {
                        width: calc(100% - 100px);
                    }
                    .bigfr {
                        width: calc(100% - 200px);
                    }
                    .line-p {
                        width: calc(100% - 20px);
                        position: absolute;
                        bottom: 0;
                        height: 1px;
                        left: 10px;
                        background: #ececec;
                    }
                    .center-from {
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        background: url(../../assets/image/left.png) no-repeat;
                        background-position: center center;
                        background-size: 65% auto;
                        &.right {
                            transform: translate(-50%, -50%) rotate(180deg);
                        }
                    }
                    em {
                        font-style: normal;
                    }
                    .from-color {
                        color: #ff4f4f;
                    }
                    .to-color {
                        color: #00ab5c;
                    }
                }
                dd:last-child {
                    p {
                        border-bottom: none;
                    }
                }
                dd.width-mid {
                    width: 50%;
                    span {
                        width: 100%;
                        font-size: 12px;
                        text-align: left;
                        line-height: 20px;
                    }
                    .line-p {
                        width: calc(100% - 10px);
                        &.line-left {
                            left: 0;
                        }
                    }
                }
                dd.span-TxFee {
                    padding-left: 23px;
                }
                .pc-show {
                    display: inline-block;
                }
                .pc-hidden {
                    display: none;
                }
            }
        }
    }
    .el-pagination {
        text-align: center;
        .el-pager li {
            background-color: #fff !important;
        }
        &.is-background .btn-next,
        &.is-background .btn-prev,
        &.is-background .el-pager li {
            background-color: #fff !important;
        }
        &.is-background .el-pager li:not(.disabled).active {
            background-color: #00b000 !important;
        }
    }
    .view-see-more {
        display: none;
        width: 96%;
        margin: 0 auto;
        text-align: center;
    }
    .more-btn {
        padding: 10px;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    .fr {
        float: right;
    }
    .fl {
        float: left;
    }
    .clearfix {
        clear: both;
    }
    .basecolor {
        color: @basecolor!important;
        cursor: pointer;
    }
    .normalcolor {
        color: #4a4a4a;
        font-weight: normal;
    }
}
@media screen and (max-width: 999px) {
    .main-page {
        .main-type {
            text-align: center;
        }
        .toggle-ul li {
            text-indent: 25px;
            em {
                left: 20px;
            }
        }
        .toggle-div {
            .div-slide {
                width: 100%;
                float: none;
                &.active {
                    display: block;
                }
                ul {
                    border-radius: 0;
                    background: #fff;
                    li {
                        div {
                            height: 100%;
                            width: 100%;
                            padding: 10px 18px;
                            float: left;
                            box-sizing: border-box;
                        }
                        div:last-child {
                            background: #f8f8f8;
                        }
                        div.input-data {
                            background: #fff;
                        }
                    }
                    li::before {
                        width: 0px;
                    }
                }
                dl {
                    width: 96%;
                    margin-left: 2%;
                    dd:last-child {
                        p {
                            border-bottom: none;
                        }
                    }
                    dd {
                        span:first-child {
                            color: #4a4a4a;
                        }
                        span {
                            b {
                                font-weight: normal;
                                color: #9b9b9b;
                            }
                        }
                    }
                    dd.width-mid {
                        width: 100%;
                        &.span-Txhash {
                            .midfr {
                                width: calc(100% - 80px);
                                text-align: right;
                            }
                        }
                        span {
                            width: auto;
                            font-size: 12px;
                            text-align: left;
                        }
                        .line-p {
                            width: calc(100% - 20px);
                            &.line-left {
                                left: 10px;
                            }
                        }
                    }
                    dd.span-TxFee {
                        padding-left: 10px;
                    }
                    dd {
                        &.view-from-to {
                            .mid-wid,
                            .fr,
                            .center-from {
                                width: 100%;
                            }
                            .fr {
                                margin-top: 30px;
                            }
                            .center-from {
                                left: 24px;
                                background-size: 20px auto;
                                transform: translate(-50%, -50%) rotate(90deg);
                            }
                        }
                    }
                    .pc-show {
                        display: none;
                    }
                    .pc-hidden {
                        display: inline-block;
                    }
                }
            }
        }
        .el-pagination {
            display: none;
        }
        .view-see-more {
            display: block;
        }
    }
}
</style>

