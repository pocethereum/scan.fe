import Vue from 'vue'
Vue.filter('formatNum', function (val, len, fixlen) {
	if (val) {
		var value = parseFloat(val);
		value = value * Math.pow(10, len);
		fixlen = Math.min(9, Math.max(2, fixlen || 6)); //至少保留2位，默认保留6位, 至多10位
		// if(len != 0){
		//     var number = 1;
		//     let length = Math.abs(len);
		//     for(let i = 0; i < length; i++){
		//         number = number * 10;
		//     }
		//     if(len > 0){
		//         value = value * number;
		//     }else if(len < 0){
		//         value = value / number;
		//     }
		// }
		//截取位数
		let suffix = '000000000';
		//支持传入数字
		value = value.toString();
		let numfooter = '';
		if (value.indexOf('e') > -1) {
			numfooter = value.substr(value.indexOf('e'));
		}
		if (value.indexOf('.') > -1) {
			//固定保留小数位
			value = value + suffix;
		} else {
			value = value + "." + suffix;
		}
		value = value.substring(0, value.lastIndexOf('.') + fixlen + 1).replace(/0+$/g, "");
		//前面已统一处理fixlen
		// if(value.indexOf('.') == (value.length - 1 )){
		//     value = value + '00'
		// }
		// if(fixlen >= 10){
		//     if(value.toString().split(".")[1].length > 6){
		//         value = value.substring(0, value.lastIndexOf('.') + 7) + numfooter;
		//         value = parseFloat(value) + '...'
		//     }
		// }else{
		value = parseFloat(value + numfooter);
		// }
		return value;
	}
	return 0
})

Vue.filter('formatAddr', function (val, type) {
	return 'poc' + val.replace('0x', '');
})

Vue.filter('formatStr', function (val, type) {
	//截取字符串
	var windowWidth = document.body.clientWidth;
	var str = val;
	var last = 0;
	var all = str.length;
	var fisrt = str.substring(0, 10);
	var last = str.substring(32, 42);
	// 没有中文括号
	if (type) {
		fisrt = str.substring(0, 8);
		last = str.substring(34, 42);
		if (windowWidth < 375) {
			fisrt = str.substring(0, 6);
			last = str.substring(36, 42);
		}
		return fisrt + '...' + last;
	}
	if (windowWidth > 1000) {
		return str;
	}

	return fisrt + '...' + last;
})
Vue.filter('formatNumStr', function (val) {
	//千位分隔符
	if (val) {
		return val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
	}
	return ''
})
Vue.filter('formatUTCDate', function (val) {
	//UTC时间换算
	if (val) {

		var str = new Date(val * 1000).toUTCString();
		if (new Date(val * 1000).getUTCHours() < 12) {
			str = str.replace("GMT", 'AM +UTC');
		} else {
			str = str.replace("GMT", 'PM +UTC');
		}
		str = str.substr(str.indexOf(' ') + 1);
		var str1 = str.substr(0, str.indexOf(' '));
		str = str.substr(str.indexOf(' ') + 1);
		var str2 = str.substr(0, str.indexOf(' '));
		str = str.substr(str.indexOf(' ') + 1);
		str = str2 + '-' + str1 + "-" + str;
		return str;
	}
	return ''
})
Vue.filter('formatUTCAgo', function (val) {
	//UTC时间换算多久之前
	if (val) {
		var nowDate = new Date().getTime();
		var date3 = nowDate - val * 1000;
		var days = Math.floor(date3 / (24 * 3600 * 1000));
		var leave1 = date3 % (24 * 3600 * 1000);
		var hours = Math.floor(leave1 / (3600 * 1000));
		var leave2 = leave1 % (3600 * 1000);
		var minutes = Math.floor(leave2 / (60 * 1000));
		if (days <= 0) {
			if (hours <= 0) {
				return minutes + ' mins';
			}
			return hours + ' hrs ' + minutes + ' mins';
		} else {
			return days + ' day ' + hours + ' hrs';
		}
	}
	return ''
})
Vue.filter('formatNumPercent', function (val1, val2) {
	//计算百分比
	val1 = parseFloat(val1);
	val2 = parseFloat(val2);
	if (isNaN(val1) || isNaN(val2)) {
		return " ";
	}
	var percent = val2 <= 0 ? "0" : (val1 / val2) * 100 + '';
	if (percent.length > 2) {
		percent = percent.substr(0, percent.lastIndexOf('.') + 3);
	}
	return percent + '%'
})
