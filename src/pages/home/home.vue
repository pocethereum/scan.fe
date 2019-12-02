<template>
    <div class="home-page" v-cloak>
        <div>
            <ul class="toggle-ul">
                <li v-on:click="changeLi(0)" :class="liIndex == 0 ? 'active' : ''">
                    <em></em>Blocks
                </li>
                <li v-on:click="changeLi(1)" :class="liIndex == 1 ? 'active' : ''">
                    <em></em>Transactions
                </li>
            </ul>
            <div class="toggle-div">
                <div :class="liIndex == 0 ? 'active' : ''" class="div-slide left">
                    <dl v-for="item in blockTable" :key="item.block_numbe">
                        <dt>
                            <span>{{ item.timestamp | formatUTCDate }}</span>
                            <span
                                class="fr basecolor"
                                v-on:click="goOther(item.block_number, '/block/')"
                            >{{ item.block_number }}</span>
                        </dt>
                        <dd>
                            <span>Block Reward:</span>
                            <span
                                class="fr"
                            >{{ (parseFloat(item.block_reward) + parseFloat(item.block_fees)) | formatNum(-18, 4) }} {{ $store.state.projectName }}</span>
                            <p class="line-p"></p>
                        </dd>
                        <dd>
                            <span>Mined By:</span>
                            <span
                                class="fr basecolor bigfr"
                                v-on:click="goOther(item.block_miner, '/address/')"
                            >
                                {{ item.block_miner | formatAddr }}
                                <b class="normalcolor"></b>
                            </span>
                        </dd>
                    </dl>
                </div>
                <div :class="liIndex == 1 ? 'active' : ''" class="div-slide right">
                    <dl v-for="item in transactionTable" :key="item.tx_hash">
                        <dt>
                            <span>{{ item.timestamp | formatUTCDate }}</span>
                            <span
                                class="fr"
                            >{{ item.value | formatNum(-18, 4) }} {{ $store.state.projectName }}</span>
                        </dt>
                        <dd>
                            <span>Txhash:</span>
                            <span
                                class="fr basecolor midfr"
                                v-on:click="goOther(item.tx_hash, '/txhash/')"
                            >{{ item.tx_hash | formatAddr }}</span>
                            <p class="line-p"></p>
                        </dd>
                        <dd>
                            <span
                                class="basecolor mid-wid"
                                v-on:click="goOther(item.from, '/address/')"
                            >{{ item.from | formatStr('str') | formatAddr }}</span>
                            <span class="center-from"></span>
                            <span
                                class="fr basecolor"
                                v-on:click="goOther(item.to, '/address/')"
                            >{{ item.to | formatStr('str') | formatAddr }}</span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "HomePage",
    data() {
        return {
            pageSize: 10,
            pageIndex: 1,
            transactionTable: [],
            blockTable: [],
            liIndex: 0
        };
    },
    mounted() {
        this.getList(this.pageIndex, this.pageSize, "address");
        this.getList(this.pageIndex, this.pageSize, "transaction");
    },
    methods: {
        getList(pageIndex, pageSize, type) {
            let that = this;
            let obj = {
                url: this.$store.state.Api.getBlocks.url,
                param: {
                    pageSize: pageSize,
                    pageIndex: pageIndex
                },
                successCannel: function(res) {
                    if (res.blocks) {
                        that.blockTable = res.blocks;
                    }
                },
                failCannel: function(res) {
                    // that.$message.error(res.err_msg);
                },
                loading: function() {
                    that.loading = false;
                }
            };
            if (type == "transaction") {
                obj.url = this.$store.state.Api.getByTransactions.url;
                obj.successCannel = function(res) {
                    if (res.transactions) {
                        that.transactionTable = res.transactions;
                    }
                };
            }
            this.$store.commit("data", obj);
        },
        goOther(param, path) {
            this.$router.push({ path: path + param });
        },
        changeLi(index) {
            this.liIndex = index;
        }
    }
};
</script>
<style lang="less" scoped>
@basecolor: #00b000;
.container {
    width: 80%;
    margin: 0% 10%;
}
.hover-point {
    cursor: pointer;
}
.home-page {
    .toggle-ul {
        width: 100%;
        height: 44px;
        // margin-top: 20px;
        overflow: hidden;
        text-align: left;
        line-height: 44px;
        li {
            width: 50%;
            position: relative;
            float: left;
            text-indent: 8px;
            font-size: 14px;
            color: #4a4a4a;
            font-weight: bold;

            &:last-child {
                padding-left: 10px;

                em {
                    left: 10px;
                }
            }

            em {
                position: absolute;
                top: 16px;
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
            width: 50%;
            float: left;

            &.left dl {
                margin-right: 10px;
                dd {
                    padding: 14px 10px;
                }
            }

            &.right dl {
                margin-left: 10px;
            }

            dl {
                background: #fff;
                text-align: left;
                width: calc(100% - 10px);
                overflow: hidden;
                border-radius: 4px;
                box-shadow: 0px 0px 5px #dcdcdc;
                margin-bottom: 10px;

                dt,
                dd {
                    padding: 10px;
                    box-sizing: border-box;
                }
                dt {
                    border-bottom: 1px solid #ececec;
                    background: #f5f5f5;
                    font-size: 12px;
                }
                dd {
                    font-size: 12px;
                    span {
                        vertical-align: middle;
                        display: inline-block;
                        float: left;
                    }
                    position: relative;
                    overflow: hidden;
                    .fr {
                        width: 45%;
                        text-align: right;
                        float: right;
                        word-break: break-all;
                    }
                    .mid-wid {
                        width: 45%;
                        word-break: break-all;
                    }
                    .midfr {
                        width: calc(100% - 100px);
                    }
                    .bigfr {
                        width: calc(100% - 100px);
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
                }
                dd:last-child {
                    p {
                        border-bottom: none;
                    }
                }
            }
        }
    }
    .fr {
        float: right;
    }
    .basecolor {
        color: @basecolor;
        cursor: pointer;
    }
    .normalcolor {
        color: #4a4a4a;
        font-weight: normal;
    }
}
@media screen and (max-width: 999px) {
    .home-page {
        margin-top: -20px;
        .container {
            width: 100%;
            margin: 0;
        }
        .toggle-ul {
            margin-top: 0;
            li {
                background: #f8f8f8;
                text-align: center;
                color: #9b9b9b;
                &.active {
                    background: #fff;
                    color: #4a4a4a;
                    em {
                        display: inline-block;
                        width: 20px;
                        height: 2px;
                        bottom: 0;
                        top: auto;
                        left: 50%;
                        transform: translate(-50%, 0);
                    }
                }
                em {
                    display: none;
                }
            }
        }
        .toggle-div {
            .div-slide {
                width: 100%;
                float: none;
                display: none;
                &.left dl {
                    margin-right: 18px;
                }
                &.active {
                    display: block;
                }
                dl {
                    margin: 10px 18px;
                    width: auto;
                    dd {
                        padding: 10px;
                        .fr {
                            width: 40%;
                        }
                        .mid-wid {
                            width: 40%;
                        }
                        .midfr {
                            width: calc(100% - 60px);
                        }
                        .bigfr {
                            width: calc(100% - 100px);
                        }
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 350px) {
    .home-page {
        .toggle-div {
            .div-slide {
                width: 100%;
                float: none;
                display: none;
                &.active {
                    display: block;
                }
                dl {
                    margin-left: 2%;
                    dt {
                        font-size: 12px;
                        line-height: 20px;
                    }
                    dd {
                        .bigfr {
                            width: calc(100% - 70px);
                        }
                    }
                }
            }
        }
    }
}
</style>

