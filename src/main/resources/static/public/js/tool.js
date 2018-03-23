
//角色下拉树
var tool_role_tree = {
    init: function (url,idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	$.ajax({
           url : url,
           async : false,
           type : "get",
           dataType : "json",
           success : function(data) {
	           var setting = {
			        check: {
			        	enable: true,
			        	chkStyle: "checkbox",
						chkboxType: { "Y": "", "N": "" }
			        },
			        data: {simpleData: {enable: true}},
			        callback: {
			           onClick: tool_role_tree.onClick,
				        onCheck: tool_role_tree.onCheck
			         }
			    };
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
	        	$.fn.zTree.getZTreeObj(treeObj_id).checkAllNodes(false);
            }
       });
                    
       $('#'+nameObj_id).click(function(){
        	tool_role_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
        });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
    	 var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        var role_form_id = treeId.replace("roles_tree","form");
        $("#"+role_form_id).data('bootstrapValidator')
    		.updateStatus('roles_name', 'NOT_VALIDATED', null).validateField('roles_name');
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
       
       var dialogOffset = nameObj.offset();
       var oneLayoutCenterOffset = $("#oneLayoutCenter").offset();
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:dialogOffset.left-oneLayoutCenterOffset.left-2, top:dialogOffset.top-oneLayoutCenterOffset.top-2}).slideDown("fast");
	   	$("body").bind("mousedown",obj,tool_role_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",tool_role_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			tool_role_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
};


//隐藏过长表格内容
var bootstrap_table_cellStyle = function(row,value,index) {
    return {
        classes:'cellStyle'
	};
}

//隐藏过长表格使用主题显示
var bootstrap_table_formatter = function(value, row, index){
     return '<span title="'+value+'">'+value+'</span>';
}


//换行过长字符表格内容
var bootstrap_table_cellStyleString = function(row,value,index) {
    return {
        classes:'cellStyleString'
	};
}

//隐藏过长表格使用主题显示
var bootstrap_table_formatterString = function(value, row, index){
	var arr = value.split(',');
	var title_arr = value.split(',');
	if(arr.length>1){
		for(var i=1;i<arr.length;i+=1){
			arr[i] = '<br>' + arr[i];
			title_arr[i] = '&#13;' + title_arr[i];
		}
		var array = arr.join(',');
		var title_array = title_arr.join(',');
		return '<span title="'+title_array+'">'+value+'</span>';
	}else{
		return '<span title="'+value+'">'+value+'</span>';
	}
}

//通用详细信息查看
var one_detail_seeDialog = {
    Init: function () {
    	$('#one_detail_seeDialog').dialog({
	       autoOpen: false,
	       title: "详细信息",
	       width: 400,
	       height: 300,
	       buttons: {
	           "关闭": function() {
	                $(this).dialog("close");
	           }
	        }
	    });
    },
	Open: function(data){
		$('#one_detail_text').val(data);
		$('#one_detail_seeDialog').dialog('open');
	}
}

/**
 * 快速选择时间
 */
function flash_settime(select,begintime,endtime) {
	var range;
	if(isNaN(select)){
		var dom = $('#'+select);
	 	range = dom.val();
	}else{
		range = select;
	}
	//dom.val(1);
	var date = new Date();
	if(endtime)
		$('#'+endtime).val($.onecloud.dateToString(date));
	if(isNaN(range)) {
		if(range == "month") {
			date.setMonth(date.getMonth() - 1);
		} else if(range == "year") {
			date.setFullYear(date.getFullYear() - 1);
		}else if(range == "one"){
			var edate = $.onecloud.dateToString(date);
			var esd = edate.split(' ');
			$('#'+endtime).val(esd[0] +" 00:00:00");
	
			var bdate = $.onecloud.dateToString(date.getTime() - 86400*1000);
			var bsd = bdate.split(' ');
			$('#'+begintime).val(bsd[0] +" 00:00:00");
			return false;
		}
	} else {
		date = new Date(date.getTime() - range*1000);
	}
	if(begintime)
		$('#'+begintime).val($.onecloud.dateToString(date));
	
}


//哈希实现
function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}  


var formatJson = function(json, options) {
	var reg = null,
		formatted = '',
		pad = 0,
		PADDING = '    '; // one can also use '\t' or a different number of spaces
	// optional settings
	options = options || {};
	// remove newline where '{' or '[' follows ':'
	options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
	// use a space after a colon
	options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
 
	// begin formatting...
	if (typeof json !== 'string') {
		// make sure we start with the JSON as a string
		json = JSON.stringify(json);
	} else {
		// is already a string, so parse and re-stringify in order to remove extra whitespace
		json = JSON.parse(json);
		json = JSON.stringify(json);
	}
 
	// add newline before and after curly braces
	reg = /([\{\}])/g;
	json = json.replace(reg, '\r\n$1\r\n');
 
	// add newline before and after square brackets
	reg = /([\[\]])/g;
	json = json.replace(reg, '\r\n$1\r\n');
 
	// add newline after comma
	reg = /(\,)/g;
	json = json.replace(reg, '$1\r\n');
 
	// remove multiple newlines
	reg = /(\r\n\r\n)/g;
	json = json.replace(reg, '\r\n');
 
	// remove newlines before commas
	reg = /\r\n\,/g;
	json = json.replace(reg, ',');
 
	// optional formatting...
	if (!options.newlineAfterColonIfBeforeBraceOrBracket) {			
		reg = /\:\r\n\{/g;
		json = json.replace(reg, ':{');
		reg = /\:\r\n\[/g;
		json = json.replace(reg, ':[');
	}
	if (options.spaceAfterColon) {			
		reg = /\:/g;
		json = json.replace(reg, ':');
	}
 
	$.each(json.split('\r\n'), function(index, node) {
		var i = 0,
			indent = 0,
			padding = '';
 
		if (node.match(/\{$/) || node.match(/\[$/)) {
			indent = 1;
		} else if (node.match(/\}/) || node.match(/\]/)) {
			if (pad !== 0) {
				pad -= 1;
			}
		} else {
			indent = 0;
		}
 
		for (i = 0; i < pad; i++) {
			padding += PADDING;
		}
 
		formatted += padding + node + '\r\n';
		pad += indent;
	});
	return formatted;
};


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
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