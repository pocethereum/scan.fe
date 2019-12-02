<template>
    <div class="default" :class="isShowBg == 'true' ? 'default-bg' : ''">
        <div>
            <img src="../assets/image/default.png" alt="">
            <p>{{ text }}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'defaultPage',
    props:{
        'text':{
            defalut:"Sorry, we are unable to locate this Address"
        },
        'isShowBg': {
            defalut:'false'
        }
    }
    
}
</script>
<style scoped> 
.default{
    width: 100%;
    padding: 60px;
    box-sizing: border-box;
    line-height: 30px;
    color: #9B9B9B;
    font-size: 12px;
    clear: both;
    text-align: center;
}
.default-bg{
    background: #F5F5F5;
    border-radius: 6px;
}
@media screen and (max-width: 999px) {
    .default-bg {
        border-radius: 0px;
    }
}
</style>

