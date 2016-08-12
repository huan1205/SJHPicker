/*!
* Product: SJHPicker
* Version: 0.2.0
* Last Updated: 2016年8月12日 17:40:52

* Copyright (c) 2016 TurboExtension
* Licensed under the MIT license
*/
Date.prototype.Format = function (fmt) {
	var o = {
	"M+": this.getMonth() + 1, //月份
	"d+": this.getDate(), //日
	"h+": this.getHours(), //小时
	"m+": this.getMinutes(), //分
	"s+": this.getSeconds(), //秒
	"q+": Math.floor((this.getMonth() + 3) / 3), //季度
	"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
function _getUniDate(object)
{
	var date = new Date(object);
	return new Date(date.getFullYear(), date.getMonth(), date.getDate()); 
}
var SJHPicker = {
	start_day: 1,
	selected_date: NaN,
	min_date: NaN, // 必须是 Date 对象
	max_date: NaN,
	format: null,
	init: function(json){
		if(json != undefined){
			if (json.max_date != null){
				if(isNaN(json.max_date.getDay())){
					console.error('max_date is invalid');
				}
				SJHPicker.max_date = _getUniDate(json.max_date);
			}
			if (json.min_date != null){
				if(isNaN(json.min_date.getDay())){
					console.error('min_date is invalid');
				}
				SJHPicker.min_date = _getUniDate(json.min_date);
			}
			if(json.min_date > json.max_date)
			{
				SJHPicker.min_date = NaN;
				SJHPicker.max_date = NaN;
				throw new Error("下限日期不能晚于上限日期");
			}
			if (json.selected_date != null){
				if (isNaN(json.selected_date.getDay()))
				{
					console.error('selected_date is invalid');
				}
				SJHPicker.selected_date = _getUniDate(json.selected_date);
			}
			if (json.start_day != null){
				if (json.start_day < 0 || json.start_day > 6){
					console.error('start_day必须在区间[0, 6]内！');
				}
				SJHPicker.start_day = json.start_day;
			}
			if (json.format != null){
				if (isNaN(new Date(new Date().Format(json.format)).getDay())){
					console.warn('格式"'+ json.format + '"可能会引发错误');
				}
				SJHPicker.format = json.format;
			}
		}
			
		$("input[data-field=date]").tap(function(){
			SJHPicker.show(this);
		});
	},

	show: function(elem){
		var elemdate;
		if (elem.value.length > 0){
			elemdate = _getUniDate(elem.value);
		}
		else{
			elemdate = _getUniDate(new Date());
		}
		if(SJHPicker.min_date != null){
			if(elemdate < SJHPicker.min_date){
				elemdate = SJHPicker.min_date;
			}
		}
		if(SJHPicker.min_date != null){
			if(elem > SJHPicker.max_date){
				elemdate = SJHPicker.max_date;
			}
		}
		SJHPicker.selected_date = elemdate;
		SJHPicker.generate_panel(elemdate);
		$('#SJHPicker').css('display', 'flex');
		$('#sjhpicker_btn_confirm').tap(function(){
			SJHPicker.confirm(elem);
		});
	},
	cancel: function(){
		$('#SJHPicker').hide();
	},
	confirm: function(elem){
		if(SJHPicker.format != null){
			elem.value = SJHPicker.selected_date.Format(SJHPicker.format);
		}
		else{
			elem.value = SJHPicker.selected_date.Format('yyyy-MM-dd');
		}
		$('#SJHPicker').hide();
	},
	generate_panel: function (date){
		var picker = $("#SJHPicker");
		if(picker == null){return;}
		var panelHTML = '<div id="sjhpicker_panel" onselectstart="return false;" unselectable="on">';
		panelHTML += '<div id="sjhpicker_title">选择日期</div>';
		var btn_preyear = '<div id="sjhpicker_btn_preyear"></div>';
		var btn_premonth = '<div id="sjhpicker_btn_premonth"></div>';
		var btn_nextmonth = '<div id="sjhpicker_btn_nextmonth"></div>';
		var btn_nextyear = '<div id="sjhpicker_btn_nextyear"></div>';
		panelHTML += '<div id="sjhpicker_myselector">' + btn_preyear + btn_premonth;
		panelHTML += '<div id="sjhpicker_myvalue">' + date.getFullYear() + ' 年 ' + (date.getMonth() + 1) + ' 月' + '</div>';
		panelHTML += btn_nextmonth + btn_nextyear + '</div>';
		panelHTML += '<div id="sjhpicker_days">';
		days = ['日', '一', '二', '三', '四', '五', '六'];
		var _start_day = this.start_day;
		for(var i = 0; i <= 6; ++i)
		{
			panelHTML += '<div class="sjhpicker_day">' + days[_start_day % 7] +'</div>';
			++_start_day;
		}
		panelHTML += '</div>';
		panelHTML += '<div id="sjhpicker_dselector"></div>';
		panelHTML += '<div id="sjhpicker_btnrow"><div id="sjhpicker_btn_today">今日</div><div id="sjhpicker_btn_confirm">确认</div><div id="sjhpicker_btn_cancel">取消</div></div>';
		panelHTML += '</div>';
		picker.html(panelHTML);
		this.generate_date_of_month(date);
		$('#sjhpicker_btn_premonth').tap(this.pre_month);
		$('#sjhpicker_btn_preyear').tap(this.pre_year);
		$('#sjhpicker_btn_nextmonth').tap(this.next_month);
		$('#sjhpicker_btn_nextyear').tap(this.next_year);
		
		if(_getUniDate(new Date()) < SJHPicker.min_date
			|| _getUniDate(new Date()) < SJHPicker.max_date){
			var tempelem = $('#sjhpicker_btn_today').remove();
		}
		else{
			$('#sjhpicker_btn_today').tap(this.select_today);
		}
		
		$('#sjhpicker_btn_cancel').tap(this.cancel);
	},
	generate_date_of_month: function (date){
		var adate = _getUniDate(date.Format('yyyy-MM-01'));
		var last_date;
		if(adate.getMonth() <= 11) {last_date = new Date(date.getFullYear(), date.getMonth() + 1, 1);}
		else {last_date = _getUniDate(date.Format('yyyy-01-01'));}
		last_date.setDate(last_date.getDate() - 1);

		var inhtml = "";
		//回溯，以补足一周，至周开始日
		if(isNaN(adate.getDay())){throw new Error('adate isNaN'); return;}
		while(adate.getDay() != this.start_day) { adate.setDate(adate.getDate() - 1);}
		
		//设置最小日期
		var start_date = _getUniDate(date.Format('yyyy-MM-01'));
		if (!isNaN(this.min_date)) {
			if (this.min_date.getFullYear() == date.getFullYear() && this.min_date.getMonth() == date.getMonth()){
				start_date = this.min_date;
			}
		}
		//设置最大日期
		var end_date = _getUniDate(last_date);
		if (!isNaN(this.max_date)){
			if (this.max_date.getFullYear() == date.getFullYear() && this.max_date.getMonth() == date.getMonth()){
				end_date = this.max_date;
			}
		}
		//添加日期元素
		do{
			//设置行
			if(adate.getDay() == this.start_day){inhtml += '<div class=sjhpicker_dayrow>';}
					if(adate < start_date || adate > end_date) {
						inhtml += ('<div class="sjhpicker_date_disabled" id="sjhpicker_date_'+ adate.Format('yyyy-MM-dd') +'">'+ adate.getDate().toString() +'</div>');
					}
					else {
						inhtml += ('<div class="sjhpicker_date" id="sjhpicker_date_'+ adate.Format('yyyy-MM-dd') +'">'+ adate.getDate().toString() +'</div>');
					}
					//结束行
			if(adate.getDay() == (this.start_day + 6) % 7){inhtml += '</div>';}
			
			adate.setDate(adate.getDate() + 1);
		}
		while(adate <= last_date);
		//补全尾部日期
		adate.setDate(adate.getDate() - 1);
		while(adate.getDay() != (this.start_day + 6) % 7)
		{
			adate.setDate(adate.getDate() + 1);
			inhtml += ('<div class="sjhpicker_date_disabled" id="sjhpicker_date_'+ adate.Format('yyyy-MM-dd') +'">'+ adate.getDate().toString() +'</div>');
			if(adate.getDay() == (this.start_day + 6) % 7){inhtml += '</div>';}
		}
		$('#sjhpicker_dselector').html(inhtml);
		
		//设置今日样式
		var today = _getUniDate(new Date());
		if(today >= start_date && today <= end_date){
			$('#sjhpicker_date_' + today.Format('yyyy-MM-d')).css('background-color', '#ddd');
		}

		//绑定按钮事件
		$('.sjhpicker_date').tap( function(){
			SJHPicker.selected_date = _getUniDate(this.id.substr(15));
			btn_dates_notToday = $('.sjhpicker_date:not('+'#sjhpicker_date_' + today.Format('yyyy-MM-d')+')');
			btn_dates_notToday.css('background-color', 'rgba(0, 0, 0, 0)');
			$('#sjhpicker_date_' + today.Format('yyyy-MM-dd')).css('background-color', '#ddd');
			$(this).css('background-color', '#F2BE45');
		});

		//刷新月份和年份
		var newYM = date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月";
		$('#sjhpicker_myvalue').text(newYM);
		//显示选中日期
		$('#sjhpicker_date_' + this.selected_date.Format('yyyy-MM-dd')).css('background-color', '#F2BE45');
		//刷新前进后退按钮
		if(!isNaN(this.min_date)){
			if(date.getMonth() == this.min_date.getMonth()
				&& date.getFullYear() == this.min_date.getFullYear())
			{
				$('#sjhpicker_btn_premonth').css('visibility', "hidden");
				$('#sjhpicker_btn_preyear').css('visibility', "hidden");
			}
			else if(date.getFullYear() == this.min_date.getFullYear()){
				$('#sjhpicker_btn_premonth').css('visibility', "inherit");
				$('#sjhpicker_btn_preyear').css('visibility', "hidden");
			}
			else{
				$('#sjhpicker_btn_premonth').css('visibility', "inherit");
				$('#sjhpicker_btn_preyear').css('visibility', "inherit");
			}
		}
		if(!isNaN(this.max_date)){
			if(date.getMonth() == this.max_date.getMonth()
				&& date.getFullYear() == this.max_date.getFullYear())
			{
				$('#sjhpicker_btn_nextmonth').css('visibility', "hidden");
				$('#sjhpicker_btn_nextyear').css('visibility', "hidden");
			}
			else if(date.getFullYear() == this.max_date.getFullYear()){
				$('#sjhpicker_btn_nextmonth').css('visibility', "inherit");
				$('#sjhpicker_btn_nextyear').css('visibility', "hidden");
			}
			else{
				$('#sjhpicker_btn_nextmonth').css('visibility', "inherit");
				$('#sjhpicker_btn_nextyear').css('visibility', "inherit");
			}
		}
	},
	getCurrentMonth: function(){
		var cmstr = $('#sjhpicker_myvalue').text();
		return new Date(parseInt(cmstr.substr(0, 4)), parseInt(cmstr.substr(7, 2)) - 1, 1);
	},
	next_month: function(){
		var currentMonth = SJHPicker.getCurrentMonth();
		currentMonth.setMonth(currentMonth.getMonth() + 1);
		SJHPicker.generate_date_of_month(currentMonth);
	},
	next_year: function(){
		var currentMonth = SJHPicker.getCurrentMonth();
		currentMonth.setFullYear(currentMonth.getFullYear() + 1);
		if(currentMonth.getMonth() > SJHPicker.max_date.getMonth())
		{
			console.log(currentMonth.getMonth() > SJHPicker.max_date.getMonth());
			currentMonth.setMonth(SJHPicker.max_date.getMonth());
		}
		SJHPicker.generate_date_of_month(currentMonth);
	},
	pre_month: function(){
		var currentMonth = SJHPicker.getCurrentMonth();
		currentMonth.setMonth(currentMonth.getMonth() - 1);
		SJHPicker.generate_date_of_month(currentMonth);
	},
	pre_year: function(){
		var currentMonth = SJHPicker.getCurrentMonth();
		currentMonth.setFullYear(currentMonth.getFullYear() - 1);
		if(currentMonth.getMonth() < SJHPicker.min_date.getMonth())
		{
			currentMonth.setMonth(SJHPicker.min_date.getMonth());
		}
		SJHPicker.generate_date_of_month(currentMonth);
	},
	select_today: function(){
		SJHPicker.setSelectedDate(_getUniDate(new Date()));
	},
	setSelectedDate: function(date){
		SJHPicker.selected_date = date;
		SJHPicker.generate_date_of_month(date);
	}
};