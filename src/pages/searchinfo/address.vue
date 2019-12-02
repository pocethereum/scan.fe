<template>
    <div class="main-page">
        <div class="main-page-wrapper">
            <div class="main-type">
                <h3>Address</h3>
                <p>{{ Address | formatAddr }}</p>
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
                            <li class="active">
                                <p>Balance:</p>
                                <span>{{ Balance | formatNum(-18,4) }} {{ $store.state.projectName }}</span>
                            </li>
                            <li class="active">
                                <p>{{ $store.state.projectName }} Value:</p>
                                <span>$ {{ POCValue | formatNum(-18,2) }}</span>
                            </li>
                            <li>
                                <p>Transactions:</p>
                                <span>{{ total }} transactions</span>
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
                                    <span
                                        class="fr basecolor"
                                        v-on:click="goOther(item.block_number, '/block/')"
                                    >{{ item.block_number }}</span>
                                </dt>
                                <dd class="fl width-mid span-Txhash">
                                    <span>Txhash:</span>
                                    <span
                                        class="fr midfr basecolor"
                                        v-on:click="goOther(item.tx_hash, '/txhash/')"
                                    >{{ item.tx_hash | formatAddr }}</span>
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
                                        :class="item.from == Address ? 'block-color' : 'basecolor'"
                                        class="mid-wid"
                                        v-on:click="goOther(item.from, '/address/')"
                                    >
                                        <em>{{ item.from | formatStr | formatAddr }}</em>
                                        <b class="from-color">-{{ item.value | formatNum(-18,4) }}</b>
                                    </span>
                                    <span class="center-from"></span>
                                    <span
                                        class="fr mid-wid"
                                        :class="item.to == Address ? 'block-color' : 'basecolor'"
                                        v-on:click="goOther(item.to, '/address/')"
                                    >
                                        <em>{{ item.to | formatStr | formatAddr }}</em>
                                        <b class="to-color">+{{ item.value | formatNum(-18,4) }}</b>
                                    </span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div class="view-see-more">
                        <div class="more-btn" v-if="isMore" v-on:click="viewLoadMore()">More</div>
                        <div v-if="!isMore">No More Data</div>
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
                text="Sorry, we are unable to locate this Address"
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
            pageSize: 10,
            pageIndex: 1,
            isShow: false,
            boxShow: false,
            Address: "",
            Balance: 0,
            POCValue: 0,
            isMore: true,
            pageNum: 0,
            isShowAll: false
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
        this.Address = this.$route.params.param;
        console.log(this.Address);
        if (this.Address.startsWith("poc")) {
            this.Address = this.Address.replace("poc", "0x");
        }
        this.getList(this.pageIndex, this.pageSize, this.Address);
        this.getBalance();
    },
    methods: {
        getList(pageIndex, pageSize) {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getByAddress.url,
                param: {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    addr: this.Address
                },
                successCannel: function(res) {
                    that.boxShow = true;
                    that.$store.state.total = res.count;
                    that.pageNum = Math.ceil(res.count / that.pageSize);
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
                    // that.$message.error(res.err_msg);
                },
                loading: function() {
                    that.loading = false;
                }
            };
            this.$store.commit("data", obj);
        },
        goOther(param, path) {
            if (this.Address == param) {
                return false;
            }
            this.$store.commit("clearData");
            this.$router.push({ path: path + param });
            if (path == "/address/") {
                this.pageIndex = 1;
                this.getList(this.pageIndex, this.pageSize);
                this.getBalance();
            }
        },
        //更改每页显示条数
        handleSizeChange(val) {
            this.pageIndex = val;
            console.log("pagesize" + this.pageSize);
            this.getList(this.pageIndex, this.pageSize);
        },
        //更改页码
        handleCurrentChange(val) {
            this.pageIndex = val;
            this.getList(this.pageIndex, this.pageSize);
            // console.log(`当前页: ${val}`);
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
        getBalance() {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getBalance.url,
                param: {
                    addr: this.Address
                },
                successCannel: function(res) {
                    that.Balance = res.balance;
                    that.getPOCValue();
                },
                failCannel: function(res) {
                    that.Balance = 0;
                }
            };
            this.$store.commit("formData", obj);
        },
        getPOCValue() {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getRate.url,
                param: {},
                successCannel: function(res) {
                    for (var i = 0; i < res.rates.length; i++) {
                        if (res.rates[i].currency == "USD") {
                            that.POCValue = that.Balance * res.rates[i].rate;
                        }
                    }
                },
                failCannel: function(res) {
                    that.POCValue = 0;
                }
            };
            this.$store.commit("formData", obj);
        }
    }
};
</script>
<style lang="less" scoped>
@basecolor: #00b000;
.block-color {
    color: #4a4a4a !important;
}

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
            text-indent: 6px;
            em {
                position: absolute;
                top: 15px;
                width: 2px;
                height: 12px;
                left: 0;
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
                    float: left;
                    width: 50%;
                    height: 54px;
                    padding: 10px;
                    padding-left: 20px;
                    p {
                        color: #9b9b9b;
                        font-size: 12px;
                        line-height: 20px;
                    }
                    span {
                        color: #4a4a4a;
                    }
                    &.active {
                        background: #fff;
                    }
                }
                li:nth-child(2n + 1) {
                    border-right: 1px solid #eeeeee;
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
                    // padding-left: 20px;
                }
                dt {
                    border-bottom: 1px solid #ececec;
                    background: #f5f5f5;
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
                        color: #4a4a4a;
                        overflow: hidden;
                        // display: flex;
                        em {
                            // flex: 1;
                            float: left;
                            font-style: normal;
                        }
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
                        transform: translate(-50%, -50%) rotate(270deg);
                        background: url(../../assets/image/arrow-green.svg)
                            no-repeat;
                        background-position: center center;
                        background-size: 18px;
                        &.right {
                            transform: translate(-50%, -50%) rotate(180deg);
                        }
                    }
                    .from-color {
                        color: #5d75f7;
                    }
                    .to-color {
                        color: #ff4f4f;
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
        .main-page-wrapper {
            background: #fff;
        }
        .main-type {
            text-align: center;
            box-shadow: 0 4px 4px -4px #dcdcdc;
            margin: 0 -4px 4px;
        }
        .toggle-ul {
            display: none;
        }
        .toggle-ul li {
            text-indent: 26px;
            em {
                left: 21px;
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
                    li {
                        width: 100%;
                        background: #f8f8f8;
                        &.active {
                            background: none;
                        }
                    }
                    li:nth-child(2n + 1) {
                        border-right: none;
                        background: #fff;
                    }
                }
                dl {
                    width: 96%;
                    margin-left: 2%;
                    dt,
                    dd {
                        padding-left: 10px;
                        font-size: 12px;
                    }
                    dd:last-child {
                        p {
                            border-bottom: none;
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
                                transform: translate(-50%, -50%) rotate(0deg);
                            }
                        }
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

