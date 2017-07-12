/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.organization')
        .controller('CharacterPageCtrl', characterPageCtrl)
        .controller('CharacterPageModelCtrl', characterPageModelCtrl)
    /** @ngInject */
    function characterPageCtrl($scope, $filter, editableOptions, editableThemes, $http, $uibModal, baProgressModal,$timeout,baseConfig) {
        var pageConfig = {
            pageNo:1,
            pageSize:baseConfig.pageSize
        };//接受参数
        var searchConfig = {
            s_name: ""
        }

        //列表加载配置
        var tableConfig = {
               url: baseConfig.serverHost + 'organization/character',
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
                    var data = data.data;
                    if(angular.toJson(data).indexOf("dataList") >= 0) {
                        $scope.users = data.dataList;
                        $scope.totalPages = data.countResults;
                        $scope.pageSize = data.pageSize;
                    }
                })
            },100)
        });

        //打开弹框
            $scope.open = function (page, size ,user ,type) {
                var modalInstance =$uibModal.open({
                    animation: true,
                    templateUrl: page,
                    controller: 'CharacterPageModelCtrl',
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
   function characterPageModelCtrl($scope,$http,$state,$timeout,toastr,formData,baseConfig){
       var vm = this;
       $scope.formData = formData;
       // remove user
       $scope.removeUser = function(user) {
           $http.delete( baseConfig.serverHost +'organization/character/'+$scope.formData.id).success(function(data){
               toastr.success('删除成功！');
               $scope.$emit("reloadList")
           });
       };
       $timeout(function(){//给多选框赋值
           var pe = [];
           if($scope.formData){
               pe = (angular.isArray($scope.formData.permission)?$scope.formData.permission:$scope.formData.permission.split(","));
               $scope.permission.selected=[];
               angular.forEach(pe,function(v){
                   angular.forEach($scope.multipleSelectItems,function(vv,i){
                       if(v == vv.id){
                           $scope.permission.selected.push(vv);
                       }
                   })
               })
           }
       },100)
       //给多选框选择数据
       $http.get( baseConfig.serverHost + 'system/menu/1').success(function(data) {
           if(angular.toJson(data).indexOf("data") >= 0) {
               $scope.multipleSelectItems = data.data
           }
       })


       // add user
       $scope.addUser = function() {
           var a= ""
           angular.forEach($scope.permission.selected,function(v){
               a = a +"," +v.id
           })
           a = a.substring(1);
           $scope.formData.permission = a;
           $http.post(baseConfig.serverHost + 'organization/character',$scope.formData).success(function(data){
               toastr.success('数据添加成功!');
           });
       };



       $scope.permission = {};
       //edit user
       $scope.editUser = function(){
           if($scope.formData){
               var a= ""
               angular.forEach($scope.permission.selected,function(v){
                   a = a +"," +v.id
               })
               $scope.formData.permission = a.substring(1);

               $http.put(baseConfig.serverHost + 'organization/character/'+$scope.formData.id, $scope.formData).success(function(data){
                   toastr.success('数据编辑成功!');
               });
           }
       }
   }
})();
