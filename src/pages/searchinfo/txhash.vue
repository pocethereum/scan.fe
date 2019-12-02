<template>
    <div class="main-page">
        <div class="main-page-wrapper">
            <div class="main-type">
                <h3>Txhash</h3>
                <p>#{{ form.Txhash | formatAddr }}</p>
            </div>
            <div v-if="!isShow && boxShow">
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
                                    <p>TxHash:</p>
                                    <span>{{ form.Txhash | formatAddr }}</span>
                                </div>
                                <div>
                                    <p>TxReceipt Status:</p>
                                    <span v-if="firstRequest == 1" class="error-color">Pending</span>
                                    <span
                                        v-if="form.TxReceiptStatus == true && firstRequest == 0"
                                        class="success-color"
                                    >Success</span>
                                    <span
                                        v-if="form.TxReceiptStatus == false && firstRequest == 0"
                                        class="error-color"
                                    >failed</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Height:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.Height, '/block/')"
                                    >
                                        {{ form.Height }}
                                        <b>({{ Confirmations }} block confirmations)</b>
                                    </span>
                                </div>
                                <div>
                                    <p>TimeStamp:</p>
                                    <span>{{ form.TimeStamp | formatUTCAgo}} ago ({{ form.TimeStamp | formatUTCDate }})</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>From:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.From, '/address/')"
                                    >
                                        {{ form.From | formatAddr }}
                                        <b></b>
                                    </span>
                                </div>
                                <div>
                                    <p>To:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.To, '/address/')"
                                    >{{ form.To | formatAddr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Value:</p>
                                    <span>{{ form.Value | formatNum(-18, 4) }} {{ $store.state.projectName }}</span>
                                </div>
                                <div>
                                    <p>Gas Limit:</p>
                                    <span>{{ form.gasLimit | formatNumStr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Gas Used By Txn:</p>
                                    <span>{{ form.gasUsedByTx | formatAddr }}</span>
                                </div>
                                <div>
                                    <p>Gas Price:</p>
                                    <span>{{ form.gasPrice | formatNum(-18, 4) }} {{ $store.state.projectName }} ({{ form.Gwei | formatNum(-9, 9) }} Gwei)</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Actual Tx Cost/Fee:</p>
                                    <span>{{ form.actualTxCost | formatNum(-18, 4) }} {{ $store.state.projectName }} (${{ PocValue | formatNum(-18, 2) }})</span>
                                </div>
                                <div>
                                    <p>Nonce & {Position}:</p>
                                    <span>{{ form.Nonce }} | { {{ form.Position }} }</span>
                                </div>
                            </li>
                            <li>
                                <div class="input-data">
                                    <p>Input Data:</p>
                                    <span>{{ form.inputData | formatAddr }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <defaultPage
                v-if="isShow && boxShow"
                text="Sorry, we are unable to locate this Transaction Hash"
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
            firstRequest: 0,
            form: {
                Txhash: "",
                TxReceiptStatus: true,
                Height: "",
                TimeStamp: "",
                From: "",
                To: "",
                Value: "",
                gasLimit: "",
                gasUsedByTx: "",
                gasPrice: "",
                actualTxCost: "",
                Nonce: "",
                inputData: "",
                Gwei: "",
                Position: ""
            },
            POCValue: 0,
            Confirmations: 0
        };
    },
    components: {
        defaultPage
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        getDetail() {
            let that = this;
            that.form.Txhash = this.$route.params.param;
            console.log(that.form.Txhash);
            if (that.form.Txhash.startsWith("poc")) {
                that.form.Txhash = that.form.Txhash.replace("poc", "0x");
            }
            let Url = this.$store.state.Api.getByHash.url;
            if (this.firstRequest != 0) {
                Url = this.$store.state.Api.getByHashPending.url;
            }
            let obj = {
                url: Url,
                param: {
                    hash: that.form.Txhash
                },
                successCannel: function(res) {
                    if (that.firstRequest == 1) {
                        that.form.Height = "--";
                        that.Confirmations = "--";
                    } else {
                        that.form.Height = res.height;
                    }
                    that.boxShow = true;
                    that.form.TimeStamp = res.time_stamp;
                    that.form.From = res.from;
                    that.form.To = res.to;
                    that.form.Value = res.value;
                    that.form.gasLimit = res.gas_limit;
                    that.form.gasUsedByTx = res.gas_used_by_tx;
                    that.form.gasPrice = res.gas_price;
                    that.form.Gwei = res.gas_price;
                    that.form.actualTxCost = res.actual_tx_cost;
                    that.form.Nonce = res.nonce;
                    that.form.inputData = res.input_data;
                    that.form.TxReceiptStatus = res.tx_receipt_status;
                    that.form.Position = res.transaction_index;
                    that.getPOCValue();
                    if (that.firstRequest == 0) {
                        that.getNewHeight();
                    }
                },
                failCannel: function(res) {
                    if (res.err_no == 30002 && that.firstRequest == 0) {
                        that.firstRequest = 1;
                        that.getDetail();
                    } else {
                        that.boxShow = true;
                        that.isShow = true;
                    }
                }
            };
            this.$store.commit("formData", obj);
        },
        goOther(param, path) {
            if (this.firstRequest == 1 && path == "/block/") {
                console.log("不跳转");
            } else {
                this.$router.push({ path: path + param });
            }
        },
        getPocValue() {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getRate.url,
                param: {},
                successCannel: function(res) {
                    for (var i = 0; i < res.rates.length; i++) {
                        if (res.rates[i].currency == "USD") {
                            that.POCValue =
                                that.form.actualTxCost * res.rates[i].rate;
                        }
                        // if(res.rates[i].currency == 'ETH'){
                        // that.form.gasPrice = that.form.gasPrice / res.rates[i].rate;
                        // }
                    }
                },
                failCannel: function(res) {
                    that.POCValue = 0;
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
                        res.block_number - parseInt(that.form.Height);
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
@successcolor: #5d75f7;
@errorcolor: #ff4f4f;
.success-color {
    color: @successcolor!important;
}
.error-color {
    color: @errorcolor!important;
}
.main-page {
    .main-type {
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 1px;
        h3 {
            color: #4a4a4a;
            font-weight: normal;
        }
        p {
            color: #9b9b9b;
            font-size: 12px;
            word-break: break-all;
        }
    }
    .toggle-ul {
        display: none;
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
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);

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
                    div:last-child {
                        border-right: none;
                    }
                    .input-data {
                        width: 100%;
                        p {
                            line-height: 30px;
                        }
                        span {
                            border: 1px solid #eee;
                            background: #f8f8f8;
                            min-height: 80px;
                            width: 100%;
                            padding: 10px;
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
                li:last-child::before {
                    width: 0;
                }
                li:nth-child(2n + 1) {
                    background: #fff;
                }
            }
        }
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
        cursor: pointer;
        color: @basecolor!important;
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
        .toggle-ul {
            display: none;
        }

        .toggle-div {
            .div-slide {
                width: 100%;
                float: none;
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
            }
        }
    }
}
</style>

