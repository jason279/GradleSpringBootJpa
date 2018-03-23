var role_tree = {
	exp: true,
	check: false,
	addNode: {},
	trackNode: {},
    init: function () {
    	$.get("/role_all_json",function(data) {
    		var setting = {
    			edit: {
    		        enable: true,
    		        showRemoveBtn: true,
    		        showRenameBtn: false,
    		        drag: {
    		               autoExpandTrigger: true,
    		               prev: true,
    		               inner: true,
    		               next: true
    		            }
    		    },
    		    check : {enable : true,nocheckInherit : false},
    		    data: {simpleData: {enable: true}},
    		    view: {addHoverDom: role_tree.addHoverDom,removeHoverDom: role_tree.removeHoverDom},
    		    callback: {
    		        beforeRemove: role_tree.beforeRemove,
    		        onClick: role_tree.onClick
    		    }
    		};
    		role_tree.trackNode = data;
            $.fn.zTree.init($("#role_tree"), setting, data).expandAll(true);
        });
    },
	onClick: function(e, treeId, treeNode){
		$("#role_permissions_role_id").val(treeNode.id);
		$.fn.zTree.getZTreeObj("role_permissions_tree").checkAllNodes(false);
	    var node = role_tree.findNodeById(treeNode.id);

	    var params = {"id": node.id};
	    $.get("/role_permissions", params, function(data) {
	        $.each(data, function(k, permission) {
	        	$.fn.zTree.getZTreeObj("role_permissions_tree").checkNode($.fn.zTree.getZTreeObj("role_permissions_tree").getNodeByParam("id", permission.id), true);
	        });
	    });
	},
    addHoverDom: function(treeId, treeNode) {
        if (treeNode.editNameFlag || $("#role_addBtn_" + treeNode.id).length > 0 || $("#role_editBtn_" + treeNode.id).length > 0)
            return;
    	var sObj = $("#" + treeNode.tId + "_span");
    	 
    	if(treeNode.pId == 0 || treeNode.pId === null || treeNode.pId === undefined || treeNode.dropRoot == false){
           var addStr = "<span class=\"button add\" id='role_addBtn_"+ treeNode.id + "' title='增加' onfocus='this.blur();'></span>";
    	   	sObj.append(addStr);
    	   	var addbtn = $("#role_addBtn_" + treeNode.id);
    	   	if (addbtn) {
    	        addbtn.bind("click", function() {
    	        	role_add_dialog.open(treeNode);
    	        });
    	    }
        }
        
       	 //if(treeNode.pId != 0 && treeNode.pId != null && treeNode.pId != undefined){
   	 	var editStr = "<span class=\"button edit\" id='role_editBtn_"+ treeNode.id + "' title='修改' onfocus='this.blur();'></span>";
    	sObj.append(editStr);
   	 	var editbtn = $("#role_editBtn_" + treeNode.id);
   	 	if(editbtn) {
            editbtn.bind("click", function() {
             	role_up_dialog.open(treeNode);
            });
        }
       	 //}
    },
    setRemoveBtn: function(treeId, treeNode) {
        if(treeNode.pId == 0 || treeNode.pId === null || treeNode.pId === undefined){
            return false;
        }else{
            return true;
        }
    },
    removeHoverDom: function(treeId, treeNode) {
        $("#role_addBtn_" + treeNode.id).unbind().remove();
        $("#role_editBtn_" + treeNode.id).unbind().remove();
    },
    beforeRemove: function(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        zTree.selectNode(treeNode);
        if(treeNode.isParent) {
            $.onecloud.succShow("存在子角色！");
            return false;
        }
        if(confirm("确认删除《" + treeNode.name + "》吗？")) {
        	var params = {"id": treeNode.id};
           	var st;
           	$.ajax({
               url : "/role_del",
               async : false,
               type : "post",
               dataType : "json",
               data : params,
               success : function(data) {
                   if (data.status == 0) {
                       $.onecloud.succShow(data.mess);
                       st = true;
                   } else if(data.status == 1) {
                       $.onecloud.errorShow(data.mess);
                       st = false;
                   }else{
                       $.onecloud.warnShow(data.mess);
                       st = false;
                   }
               }
           	});
           	return st;
        }else{
        	return false;
        }
    },
    expAll: function(){
	    if(role_tree.exp) {
	    	$.fn.zTree.getZTreeObj("role_tree").expandAll(false);
	        role_tree.exp = false;
	    } else {
	    	$.fn.zTree.getZTreeObj("role_tree").expandAll(true);
	        role_tree.exp = true;
	    }
    },
    checkAll: function(){
	    if(role_tree.check) {
	    	$.fn.zTree.getZTreeObj("role_tree").checkAllNodes(false);
	        role_tree.check = false;
	    } else {
	    	$.fn.zTree.getZTreeObj("role_tree").checkAllNodes(true);
	        role_tree.check = true;
	    }
    },
    changeNodes: function(){
    	var nodes = $.fn.zTree.getZTreeObj("role_tree").transformToArray($.fn.zTree.getZTreeObj("role_tree").getNodes());
        var newNodes = new Array();
        var zNodes = new Array();
        $.each(nodes, function(key, node) {
            var newNode = {"id": node.id, "pid": -1 ,"check": -1, "sort": -1};
            if(key<role_tree.trackNode.length && node.id==role_tree.trackNode[key].id) {
                if(role_tree.trackNode[key].sort != key)
                    newNode.sort = key;
                if(node.pId!=role_tree.trackNode[key].pId) {
                    if(node.pId == null)
                        newNode.pid = 0;
                    else
                        newNode.pid = node.pId;
                }
                if(role_tree.trackNode[key].checked) {
                    if(!node.checked && !node.getCheckStatus().half) {
                        newNode.check = 0;
                    }
                } else {
                    if(node.checked || node.getCheckStatus().half) {
                        newNode.check = 1;
                    }
                }
            } else {
                var oldNode = role_tree.findNodeById(node.id);
                if(oldNode == null) {
                    newNode.sort = key;
                    newNode.pid = node.pId;
                    newNode.check = node.checked ? 0 : 1;
                } else {
                    if(oldNode.sort != key)
                        newNode.sort = key;
                    if(node.pId != oldNode.pId) {
                        if(node.pId == null)
                            newNode.pid = 0;
                        else
                            newNode.pid = node.pId;
                    }
                    if(oldNode.checked) {
                        if(!node.checked && !node.getCheckStatus().half) {
                            newNode.check = 0;
                        }
                    } else {
                        if(node.checked || node.getCheckStatus().half) {
                            newNode.check = 1;
                        }
                    }
                }
            }
            newNodes.push(newNode);
            zNodes.push({
                id: node.id,
                pId: node.pId,
                sort: key,
                checked: (node.checked||node.getCheckStatus().half),
                name: node.name,
                dropInner: node.dropInner,
                dropRoot: node.dropRoot,
                iconSkin: node.iconSkin
            });
        });
        var str = "";
        $.each(newNodes, function(key, val) {
            if(val.pid!=-1 || val.check!=-1 || val.sort!=-1) {
                str = str  + val.id + "_" + val.pid + "_" + val.check + "_" + val.sort + "&";
            }
        });
        var params = {"str": str};
        if(str != "") {
            $.post("/role_oc_up", params, function(data) {
                if (data.status == 0) {
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                }
            });
        } else {
            $.onecloud.warnShow("更新成功！");
        }
    },
    //根据ID获取树的节点
    findNodeById: function(id) {
        for(var i in role_tree.trackNode) {
            if(role_tree.trackNode[i].id == id) {
                return role_tree.trackNode[i];
            }
        }
        return null;
    }
};


var role_permissions_tree = {
	exp: true,
	check: false,
	addNode: {},
    init: function() {
    	 //获取有效的权限列表并生成树
        $.get("/permission_allow_json", function(data) {
        	var setting = {
        		check : {enable : true,nocheckInherit : true},
                data: {simpleData: {enable: true}},
                callback: {
        	        onClick: role_permissions_tree.onClick
        	    }
        	};
            $.fn.zTree.init($("#role_permissions_tree"), setting, data).expandAll(true);
            $.fn.zTree.getZTreeObj("role_permissions_tree").checkAllNodes(false);
        });
    },
    onClick: function(e, treeId, treeNode) {
    	$.fn.zTree.getZTreeObj("role_permissions_tree").checkNode(treeNode, !treeNode.checked, true, true);
    	return false;
    },
    expAll: function(){
	    if(role_permissions_tree.exp) {
	    	$.fn.zTree.getZTreeObj("role_permissions_tree").expandAll(false);
	        role_permissions_tree.exp = false;
	    } else {
	    	$.fn.zTree.getZTreeObj("role_permissions_tree").expandAll(true);
	        role_permissions_tree.exp = true;
	    }
    },
    checkAll: function(){
        if(role_permissions_tree.check) {
        	$.fn.zTree.getZTreeObj("role_permissions_tree").checkAllNodes(false);
            role_permissions_tree.check = false;
        } else {
        	$.fn.zTree.getZTreeObj("role_permissions_tree").checkAllNodes(true);
            role_permissions_tree.check = true;
        }
    },
    changeNodes: function(){
    	var role_id = $("#role_permissions_role_id").val();
        if(role_id == '' || role_id == null || role_id == undefined){
        	$.onecloud.warnShow("请先选择角色");
        	return;
        }
        var node = role_tree.findNodeById(role_id);
        if(node.dropInner == false){
            var nodes = $.fn.zTree.getZTreeObj("role_permissions_tree").transformToArray($.fn.zTree.getZTreeObj("role_permissions_tree").getNodes());
            var newNodes = new Array();
            $.each(nodes, function(key, node) {
                if(node.checked) {
                    newNodes.push(node);
                }
            });
            var str = "";
            $.each(newNodes, function(key, val) {
                str = str  + val.id + "&";
            });

            var params = {"id": role_id,"str": str};
            $.post("/role_permissions_up", params, function (data) {
                if (data.status == 0) {
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                }
            });
        }else{
            $.onecloud.warnShow("目录无须设置权限！");
        }
    }
};

var role_add_dialog = {
    init: function () {
    	//初始化添加角色对话框
    	$('#role_add_form').bootstrapValidator({
			threshold: 1,
			feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				name: {validators: {notEmpty: {message: '此项不能为空'}}},
				is: {validators: {notEmpty: {message: '此项必须选择'}}},
			}
		}).on('success.form.bv', function(e) {
		  	$.post("/role_add", $("#role_add_form").serialize(), function(data) {
		  		if (data.status == 0) {
		  			var newNode = {
	  					isParent : false,
	  					id: data.js.id,
	  					pId: data.js.pId,
	  					sort: data.js.sort,
	  					name: data.js.name,
	  					dropInner: data.js.dropInner,
	  					dropRoot: data.js.dropRoot,
	  					iconSkin: data.js.iconSkin
		          	};
		          	if(role_tree.addNode) {
		          		$.fn.zTree.getZTreeObj("role_tree").addNodes(role_tree.addNode, newNode);
		          		role_tree.trackNode.push(newNode);
		          	} else {
		          		$.fn.zTree.getZTreeObj("role_tree").addNodes(null, newNode);
		          		role_tree.trackNode.push(newNode);
	          		}
	
		          	$('#role_add_dialog').dialog("close");
		          	$.onecloud.succShow(data.mess);
		      	} else if(data.status == 1) {
		      		$.onecloud.errorShow(data.mess);
		      	}else{
		      		$.onecloud.warnShow(data.mess);
		      	}
	  		});
    	});
    	$('#role_add_dialog').dialog({
    		autoOpen: false,
    		width: 300,
    		buttons: {
    	      "添加": function() {
    	          $("#role_add_form").submit();
    	      },
    	      "关闭": function() {
    	          $(this).dialog("close");
    	      }
    	    }
    	});
    },
    open: function (treeNode) {
    	console.log(treeNode)
    	//打开添加角色对话框
	    $('#role_add_form')[0].reset();
	    
	    if(treeNode === null || treeNode === undefined){
	    	$("#role_add_pId").val("0");
	    	$('#role_add_dialog').dialog( "option", "title", "添加");
	    	role_tree.addNode = null;
	    }else{
	    	$("#role_add_pId").val(treeNode.id);
	    	$('#role_add_dialog').dialog( "option", "title", "添加到《"+treeNode.name+"》下");
	    	role_tree.addNode = treeNode;
	    }
	    
	    $('#role_add_dialog').dialog('open');
	    $('#role_add_form').data('bootstrapValidator').resetForm(false);
    }
};

var role_up_dialog = {
    init: function () {
    	$('#role_up_form').bootstrapValidator({
    		threshold: 1,
    		feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	            name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
	   	}).on('success.form.bv', function(e) {
	        var tid = $("#role_up_tid").val();
	        $.post("/role_up", $("#role_up_form").serialize(), function(data) {
	            if (data.status == 0) {
	                var node = $.fn.zTree.getZTreeObj("role_tree").getNodeByTId(tid);
	                node.name = data.js.name;
	                node.dropInner = data.js.dropInner;
	                node.dropRoot = data.js.dropRoot;
	                node.iconSkin = data.js.iconSkin
	                $.fn.zTree.getZTreeObj("role_tree").updateNode(node);
	                role_tree.addHoverDom(0, node);
	                
	                $('#role_up_dialog').dialog("close");
	                $.onecloud.succShow(data.mess);
	            } else if(data.status == 1) {
	                $.onecloud.errorShow(data.mess);
	            }else{
	                $.onecloud.warnShow(data.mess);
	            }
	        });
	    });
	    $('#role_up_dialog').dialog({
	        autoOpen: false,
	        width: 300,
	        buttons: {
	            "修改": function() {
	                $("#role_up_form").submit();
	            },
	            "关闭": function() {
	                $(this).dialog("close");
	            }
	        }
	    });
    },
    open: function (treeNode) {
    	$('#role_up_form')[0].reset();
       	$("#role_up_id").val(treeNode.id);
		$("#role_up_tid").val(treeNode.tId);
		$("#role_up_name").val(treeNode.name);
		
		$('#role_up_dialog').dialog( "option", "title", "修改《"+treeNode.name+"》");
		$('#role_up_dialog').dialog('open');
      
		$('#role_up_form').data('bootstrapValidator').resetForm(false);
    }
};


$(function() {
	role_tree.init();
	role_permissions_tree.init();
	role_add_dialog.init();
	role_up_dialog.init();
});
