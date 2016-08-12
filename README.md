# SJHPicker
卡片式日历选择器，原生js编写，无依赖，同时提供jquery和zepto版本！

### 预览

![SJHPicker](https://raw.githubusercontent.com/ExTEnS10N/SJHPicker/master/img/SJHPicker.jpg)

### 兼容性和支持

IE9及以上，Chrome，Safari，微信内置浏览器  
（PS:Safari 的原生js很不方便,尤其是Date对象）  

支持的元素：input  
（目前暂未完美支持页面内有多个input，所有input的预设如上限日期等将一样）  

支持事件：  点击 ( click / tap )  

依赖性：  
SJHPicker.js，原生js编写，无依赖  
SJHPicker-zepto.js，依赖于 Zepto.js，支持且仅tap事件（1.2.0版测试通过，其他版本未测试）  
SJHPicker-jquery.js 依赖于 JQuery，换成zepto也不会有问题 （3.1.0 slim版测试通过，其他版本未测试）  

注：依赖文件在本库中也有提供。

### 用法示例

#### 1. 原生js

所需文件：  
1. SJHPicker.css
2. SJHPicker.js

```
<!DOCTYPE html>
<html>
	<head>
		<!--必需-->
		<link rel="stylesheet" type="text/css" href="css/SJHPicker.css">
	</head>
	<body>
		<input type="text" data-field="date" placeholder="请选择日期"/>
		<!--必需-->
		<div id="SJHPicker" style="display:none;"></div>
		<!--必需-->
		<script type="text/javascript" src="js/SJHPicker.js"></script>

		<script type="text/javascript">
			SJHPicker.init({					   //初始化控件
				max_date: new Date('2016-09-20'),  //日期上限
				min_date: new Date('2016-07-12'),  //日期下限
				start_day: 1,					   //周开始日，0为周日，1-6为周一至周六
				format: 'yyyy-MM-dd'		       //输出日期格式
			});
		</script>
	</body>
</html>
```

#### 2. zepto

所需文件：  
1. SJHPicker.css
2. zepto.min.js
3. zepto-touch.min.js //zepto 的 touch 模块，可自行合并到 zepto.js 中
4. SJHPicker.js

```
<!DOCTYPE html>
<html>
	<head>
		<!--必需-->
		<link rel="stylesheet" type="text/css" href="css/SJHPicker.css">
		<!--必需-->
		<script type="text/javascript" src="js/zepto.min.js"></script>
		<!--必需-->
		<script type="text/javascript" src="js/zepto-touch.js"></script>
		<!--必需-->
		<script type="text/javascript" src="js/SJHPicker-zepto.js"></script>
		<script type="text/javascript">
			$(function() {
				SJHPicker.init({				   //初始化控件
				max_date: new Date('2016-09-20'),  //日期上限
				min_date: new Date('2016-07-12'),  //日期下限
				start_day: 1,					   //周开始日，0为周日，1-6为周一至周六
				format: 'yyyy-MM-dd'		       //输出日期格式
				});
			});
		</script>
	</head>
	<body>
		<input type="text" data-field="date" placeholder="请选择日期"/>
		<!--必需-->
		<div id="SJHPicker" style="display:none;"></div>
	</body>
</html>
```

#### 3. JQuery

所需文件：  
1. SJHPicker.css
2. jquery-3.1.0.slim.min.js
3. SJHPicker.js

```
<!DOCTYPE html>
<html>
	<head>
		<!--必需-->
		<link rel="stylesheet" type="text/css" href="css/SJHPicker.css">
		<!--必需-->
		<script type="text/javascript" src="js/jquery-3.1.0.slim.min.js"></script>
		<!--必需-->
		<script type="text/javascript" src="js/SJHPicker-jquery.js"></script>
		<!--必需-->
		<script type="text/javascript">
			$(function() {
				SJHPicker.init({				   //初始化控件
				max_date: new Date('2016-09-20'), //日期上限
				min_date: new Date('2016-07-12'),  //日期下限
				start_day: 1,					   //周开始日，0为周日，1-6为周一至周六
				format: 'yyyy-MM-dd'		       //输出日期格式
				});
			});
		</script>
	</head>
	<body>
		<input type="text" data-field="date" placeholder="请选择日期"/>
		<!--必需-->
		<div id="SJHPicker" style="display:none;"></div>
	</body>
	
</html>
```

### TODO
- [ ] 支持不同input不同预设；
- [ ] 支持更多元素和事件，支持自行绑定；
- [ ] 国际化支持；
