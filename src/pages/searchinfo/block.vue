<template>
    <div class="main-page">
        <div class="main-type-wrapper">
            <div class="main-type">
                <h3>Block</h3>
                <p>#{{ form.height }}</p>
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
                                    <p>Height:</p>
                                    <span class>{{ form.height }}</span>
                                </div>
                                <div>
                                    <p>TimeStamp:</p>
                                    <span>{{ form.TimeStamp | formatUTCAgo}} ago ({{ form.TimeStamp | formatUTCDate }})</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Transactions:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.height, '/transactions/')"
                                    >{{ form.Transactions }} transactions</span>
                                </div>
                                <div>
                                    <p>Hash:</p>
                                    <span>{{ form.Hash | formatAddr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Parent Hash:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.ParentHash, '/block/')"
                                    >{{ form.ParentHash | formatAddr }}</span>
                                </div>
                                <div>
                                    <p>Mined By:</p>
                                    <span
                                        class="basecolor"
                                        v-on:click="goOther(form.MinedBy, '/address/')"
                                    >
                                        {{ form.MinedBy | formatAddr }}
                                        <b></b>
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Difficulty:</p>
                                    <span>{{ form.Difficulty | formatNumStr }}</span>
                                </div>
                                <div>
                                    <p>Total Difficulty:</p>
                                    <span>{{ form.TotalDifficulty | formatNumStr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Size:</p>
                                    <span>{{ form.Size }} bytes</span>
                                </div>
                                <div>
                                    <p>Gas Used:</p>
                                    <span>{{ form.GasUsed | formatNumStr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Gas Limit:</p>
                                    <span>{{ form.GasLimit | formatNumStr }}</span>
                                </div>
                                <div>
                                    <p>Block Reward:</p>
                                    <span>{{ form.BlockReward + form.BlockFees | formatNum(-18, 4) }} {{ $store.state.projectName }} ({{form.BlockReward | formatNum(-18, 4) }} + {{ form.BlockFees | formatNum(-18, 4) }})</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Nonce:</p>
                                    <span>{{ form.Nonce | formatNumStr }}</span>
                                </div>
                                <div>
                                    <p>Dealine:</p>
                                    <span>{{ form.Dealine | formatNumStr }}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Scoop:</p>
                                    <span>{{ form.Scoop | formatNumStr }}</span>
                                </div>
                                <div>
                                    <p>Extra Data:</p>
                                    <span>{{ form.ExtraData }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <defaultPage v-if="isShow && boxShow" text="Sorry, we are unable to locate this Block"></defaultPage>
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
            form: {
                height: "",
                TimeStamp: "",
                Transactions: "",
                Hash: "",
                ParentHash: "",
                MinedBy: "",
                Difficulty: "",
                TotalDifficulty: "",
                Size: "",
                GasUsed: "",
                GasLimit: "",
                BlockReward: "",
                BlockFees: "",
                Nonce: "",
                Dealine: "",
                ExtraData: "",
                Scoop: ""
            },
            NumOrStr: /^[0-9]*$/
        };
    },
    components: {
        defaultPage
    },
    mounted() {
        if (this.NumOrStr.test(this.$route.params.param)) {
            this.form.height = this.$route.params.param;
            this.getDetail(this.$store.state.Api.getHeight.url, 0);
        } else {
            this.getDetail(this.$store.state.Api.getBlockHash.url, 1);
        }
    },
    methods: {
        getDetail(Url, index) {
            let that = this;
            // that.form.height = this.$route.params.param;
            let obj = {
                url: Url,
                param: {
                    height: this.$route.params.param
                },
                successCannel: function(res) {
                    that.boxShow = true;
                    that.form.height = res.height;
                    that.form.TimeStamp = res.timestamp;
                    that.form.Transactions = res.transactions;
                    that.form.Hash = res.hash;
                    that.form.ParentHash = res.parent_hash;
                    that.form.MinedBy = res.miner;
                    that.form.Difficulty = res.difficult;
                    that.form.TotalDifficulty = res.total_difficult;
                    that.form.Size = res.size;
                    that.form.GasUsed = res.gas_used;
                    that.form.GasLimit = res.gas_limit;
                    that.form.BlockReward = parseFloat(res.block_reward);
                    that.form.BlockFees = parseFloat(res.block_fees);
                    that.form.Nonce = res.nonce;
                    that.form.Dealine = res.deadline;
                    that.form.ExtraData = res.extra_data;
                    that.form.Scoop = res.scoop;
                },
                failCannel: function(res) {
                    that.boxShow = true;
                    that.isShow = true;
                }
            };
            if (index != 0) {
                obj.param = {
                    hash: this.$route.params.param
                };
            }
            this.$store.commit("formData", obj);
        },
        goOther(param, path) {
            this.$router.push({ path: path + param });
            if (path == "/block/") {
                this.getDetail(this.$store.state.Api.getBlockHash.url, 1);
            }
        }
    }
};
</script>
<style lang="less" scoped>
@basecolor: #00b000;
.main-page {
    .main-type {
        background: #fff;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
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
                    }
                    div:last-child {
                        border-right: none;
                    }
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
        .main-type-wrapper {
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

