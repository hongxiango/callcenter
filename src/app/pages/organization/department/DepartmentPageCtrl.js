/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.organization')
        .controller('DepartmentPageCtrl', departmentPageCtrl)
        .controller('DepartmentPageModelCtrl', departmentPageModelCtrl)

    /** @ngInject */
    function departmentPageCtrl($scope, $filter, editableOptions, editableThemes, $http, $uibModal, baProgressModal,$timeout,baseConfig,localStorageService) {

        console.log(localStorageService.get("user"))
        var userData = localStorageService.get("user");
        var pageConfig = {
            pageNo:1,
            pageSize:baseConfig.pageSize
        };//接受参数
        var searchConfig = {
            s_name: ""
        }

        //列表加载配置
        var tableConfig = {
               url: baseConfig.serverHost + 'organization/department',
               params: {},
               method:"get"
              }

          $timeout(function(){
              $scope.$broadcast("reloadList",angular.merge({},pageConfig));
          })


        $scope.searchUser = function(){
            $scope.$broadcast("reloadList",{s_name:$scope.$$childHead.name});
        }
        $scope.pageChanged = function(newPage) {
            getResultsPage(newPage);
        };

        function getResultsPage(pageNumber) {
            pageNumber = pageNumber?pageNumber:1;
            $scope.$broadcast("reloadList",angular.merge({},pageConfig,{pageNo:pageNumber}));
        }


        //接受广播刷新页面
        $scope.$on("reloadList", function (a,b) {
            angular.merge(tableConfig.params,b);
            $timeout(function(){
                $http(tableConfig).success(function(data) {
                    if(angular.toJson(data).indexOf("data") >= 0) {
                        var data = data.data
                        var my_depart = [];
                        if(userData && userData.username != "admin"){//管理员显示全部，其他人只显示自己的
                            angular.forEach(data.dataList, function(item) {
                                if(item.id == userData.department){
                                    my_depart.push(item);
                                }
                            })
                            $scope.users = my_depart;
                            $scope.totalPages = 1;
                            $scope.pageSize = 1;
                        }else{
                            $scope.users = data.dataList;
                            $scope.totalPages = data.countResults;
                            $scope.pageSize = data.pageSize;
                        }

                    }
                })
            },100)
        });

        //打开弹框
            $scope.open = function (page, size ,user ,type) {
                var modalInstance =$uibModal.open({
                    animation: true,
                    templateUrl: page,
                    controller: 'DepartmentPageModelCtrl',
                    size: size,
                    resolve: {
                        formData: function () {
                            return (type?user:{});
                        }
                    }
                });

                modalInstance.result.then(function(result) {
                }, function(reason) {
                    $timeout(function(){
                        $scope.$broadcast("reloadList");
                    })
                });
                $scope.openProgressDialog = baProgressModal.open;
            };

        //选择样式
        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


    }
    //弹出框控制器
   function departmentPageModelCtrl($scope,$http,$state,$timeout,toastr,formData,baseConfig){
       var vm = this;
       $scope.formData = formData;
       $scope.chargehand_charas = {};
       $scope.member_charas = {};
       $scope.chargehand = {};
       // remove user
       $scope.removeUser = function(user) {
           $http.delete( baseConfig.serverHost +'organization/department/'+$scope.formData.id).success(function(data){
               if(data.error == false){
                   toastr.success('删除成功！');
                   $scope.$emit("reloadList")
               }
           });
       };
       function multiValueSet(dealValue,processValue,allSelectValue){
           var x = [];
           var selected = [];
           if(!angular.equals({},dealValue)){
               processValue = (angular.isNumber(processValue)?processValue.toString():processValue)
               x = (angular.isArray(processValue)?processValue:processValue.split(","));
               angular.forEach(x,function(v){
                   angular.forEach(allSelectValue,function(vv,i){
                       if(v == vv.id){
                           selected.push(vv);
                       }
                   })
               })
           }
           return selected;
       }
        function objectToSting(select){
            var y = "";
            angular.forEach(select,function(v){
                y = y + "," + v.id
            })
            y  =(y.indexOf(",") >= 0?y.substring(1):"");
            return y;
        }

       //给多选框选择数据
       $http.get( baseConfig.serverHost + 'organization/character',{params:{pageSize:30}}).success(function(data) {
           if(angular.toJson(data).indexOf("data") >= 0) {
               $scope.multipleSelectItems = data.data.dataList;
               $scope.chargehand_charas.selected = multiValueSet($scope.formData,$scope.formData.chargehand_charas,data.data.dataList);
               $scope.member_charas.selected = multiValueSet($scope.formData,$scope.formData.member_charas,data.data.dataList);
           }
       })
       //给多选框选择数据
       $http.get( baseConfig.serverHost + 'organization/member',{params:{pageSize:30}}).success(function(data) {
           if(angular.toJson(data).indexOf("data") >= 0) {
               $scope.memberMultipleSelectItems = data.data.dataList;
               $scope.chargehand.selected = multiValueSet($scope.formData,$scope.formData.chargehand,data.data.dataList);
           }
       })


       // add user
       $scope.addUser = function() {
           $scope.formData.chargehand = objectToSting($scope.chargehand.selected);
           $scope.formData.chargehand_charas = objectToSting($scope.chargehand_charas.selected);
           $scope.formData.member_charas = objectToSting($scope.member_charas.selected);
           $http.post(baseConfig.serverHost + 'organization/department',$scope.formData).success(function(data){
               if(data.error == false) {
                   toastr.success('数据添加成功!');
               }
           });
       };



       //edit user
       $scope.editUser = function(){
           $scope.formData.chargehand = objectToSting($scope.chargehand.selected);
           $scope.formData.chargehand_charas = objectToSting($scope.chargehand_charas.selected);
           $scope.formData.member_charas = objectToSting($scope.member_charas.selected);
           if($scope.formData){
               $http.put(baseConfig.serverHost + 'organization/department/'+$scope.formData.id, $scope.formData).success(function(data){
                   if(data.error == false){
                       toastr.success('数据编辑成功!');
                   }
               });
           }
       }
   }
})();
