//user-table工具栏
var user_table_custom ={
    init: function () {
    	//定义按钮动作
        $("#user_add").click(function() {
            user_add_dialog.open()
        });
        $("#user_up").click(function() {
            user_up_dialog.open()
        });
        $("#user_del").click(function() {
            user_del()
        });
	}
};

var user_add_dialog = {
    init: function () {
    	//初始化添加用户对话框
        $('#user_add_form').bootstrapValidator({
        	threshold: 1,
           feedbackIcons: {
    	    	valid: 'glyphicon glyphicon-ok',
    	    	invalid: 'glyphicon glyphicon-remove',
    	    	validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                number: {validators: {notEmpty: {message: '此项不能为空'}}},
                name: {validators: {notEmpty: {message: '此项不能为空'}}},
                password: {validators: {callback: {callback: function(value, validator) {return true;}}}},
                phone: {validators: {callback: {callback: function(value, validator) {return true;}}}},
                email: {validators: {
    	          	    	callback: {callback: function(value, validator) {return true;}},
    	          			emailAddress: {message: '请填写合法邮箱'}
    	        }},
                roles_name: {validators: {notEmpty: {message: '至少选一个角色'}}}
            }
    	 }).on('success.form.bv', function(e) {
            $.post("/user_add", $("#user_add_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#user_add_dialog').dialog("close");
                    $('#user-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                    }
               });
        });
        $('#user_add_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "添加": function() {
                    $("#user_add_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });
    },
    open: function () {
    	$('#user_add_form')[0].reset();
        $('#user_add_roles_id').val("");
        
        tool_role_tree.init('role_allow_json','user_add_roles_id','user_add_roles_name',
        	'user_add_roles_panel','user_add_roles_tree');
        	
        $('#user_add_dialog').dialog( "option", "title", "添加用户");
        $('#user_add_dialog').dialog('open');
        $('#user_add_form').data('bootstrapValidator').resetForm(false);
    }
};


var user_up_dialog = {
    init: function () {
    	//初始化修改用户对话框
        $('#user_up_form').bootstrapValidator({
        	threshold: 1,
           feedbackIcons: {
    	    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                number: {validators: {notEmpty: {message: '此项不能为空'}}},
                name: {validators: {notEmpty: {message: '此项不能为空'}}},
                password: {validators: {callback: {callback: function(value, validator) {return true;}}}},
                phone: {validators: {callback: {callback: function(value, validator) {return true;}}}},
                email: {validators: {
    	          	    	callback: {callback: function(value, validator) {return true;}},
    	          			emailAddress: {message: '请填写合法邮箱'}
    	        }},
                roles_name: {validators: {notEmpty: {message: '至少选一个角色'}}}
            }
    	 }).on('success.form.bv', function(e) {
            $.post("/user_up", $("#user_up_form").serialize(), function(data) {
                    if (data.status == 0) {
                        $('#user_up_dialog').dialog("close");
                        $('#user-table').bootstrapTable('refresh', {silent: true});
                        $.onecloud.succShow(data.mess);
                    } else if(data.status == 1) {
                        $.onecloud.errorShow(data.mess);
                    }else{
                        $.onecloud.warnShow(data.mess);
                      }
               });
        });
        $('#user_up_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "修改": function() {
                    $("#user_up_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });
    },
    open: function () {
    	//$('#user_up_form')[0].reset();
        $('#user_up_roles_id').val("");
        var selection = $('#user-table').bootstrapTable('getSelections');
        if (selection.length === 1) {
            $.each(selection, function(key, row) {
                $("#user_up_id").val(row.id);
                $("#user_up_number").val(row.number);
                $("#user_up_name").val(row.name);
                $("#user_up_phone").val(row.phone);
                $("#user_up_email").val(row.email);
                $("#user_up_password").val("");
                
    			tool_role_tree.init('role_allow_json','user_up_roles_id','user_up_roles_name',
        				'user_up_roles_panel','user_up_roles_tree');

    			var treeObj = $.fn.zTree.getZTreeObj("user_up_roles_tree");
                var params = {"id": row.id};
                $.get("/user_roles", params , function(data) {
                    //var roles_id = "";
                    $.each(data, function(k, role) {
                        //roles_id = roles_id + role.id +',';
                        treeObj.checkNode(treeObj.getNodeByParam("id", role.id), true);
                      });
                    //roles_id = roles_id.substring(0,roles_id.length-1);
                    $("#user_up_roles_id").val(row.roles_id);
                    $("#user_up_roles_name").val(row.roles_name);
                });
                $('#user_up_dialog').dialog( "option", "title", "修改用户<"+row.name+">");
            });
            $('#user_up_dialog').dialog('open');
            $('#user_up_form').data('bootstrapValidator').resetForm(false);
        } else {
            $.onecloud.warnShow("修改只能选一个项！");
        }
    }
};

var user_table = {
    init: function () {
    	//初始化用户表格
        $('#user-table').bootstrapTable({
            method: 'get',
            url: '/user_page_json',
            cache: false,
            striped: true,
            pagination: true,
            sidePagination: 'server',
            pageNumber: '1',
            pageSize: '10',
            pageList: '[10, 25, 50, 100]',
            search: true,
            showColumns: false,
            showRefresh: true,
            clickToSelect: true,
            toolbar: '#user-custom-toolbar',
            queryParams: function(params) {
               return params;
            },
            columns: [{field: 'state',checkbox: true},
            	{field: 'number',title: '工号',align: 'left',width:'10%',sortable: false},
                {field: 'name',title: '名字',align: 'left',width:'10%',sortable: false},
                {field: 'phone',title: '电话',align: 'left',width:'20%',sortable: false,clickToSelect: false},
                {field: 'email',title: '邮箱',align: 'left',width:'20%',sortable: false,clickToSelect: false},
                {field: 'roles_name',title: '角色',align: 'left',width:'40%',sortable: false,clickToSelect: false},
            ]
        });
    }
};

$(function() {
	user_table_custom.init();
	user_add_dialog.init();
	user_up_dialog.init();
	user_table.init();
});
