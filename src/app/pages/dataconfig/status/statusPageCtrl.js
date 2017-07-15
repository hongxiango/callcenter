/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.organization')
        .controller('StatusPageCtrl', statusPageCtrl)
        .controller('StatusPageModelCtrl', statusPageModelCtrl)
    /** @ngInject */
    function statusPageCtrl($scope, $filter, editableOptions, editableThemes, $http, $uibModal, baProgressModal,$timeout,baseConfig) {
        var pageConfig = {
            pageNo:1,
            pageSize:baseConfig.pageSize
        };//接受参数
        var searchConfig = {
            s_name: ""
        }

        //列表加载配置
        var tableConfig = {
               url: baseConfig.serverHost + 'data/customerStatus',
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

        $scope.getBool = function(v){
            return v == true?"是":"否";
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
                    controller: 'StatusPageModelCtrl',
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
   function statusPageModelCtrl($scope,$http,$state,$timeout,toastr,formData,baseConfig){
       var vm = this;
       $scope.formData = formData;
       // remove user
       $scope.removeUser = function(user) {
           $http.delete( baseConfig.serverHost +'data/customerStatus/'+$scope.formData.id).success(function(data){
               if(data.error == false){
                   toastr.success('删除成功！');
                   $scope.$emit("reloadList")
               }
           });
       };


       // add user
       $scope.addUser = function() {
           $http.post(baseConfig.serverHost + 'data/customerStatus',$scope.formData).success(function(data){
               if(data.error == false) {
                   toastr.success('数据添加成功!');
               }
           });
       };



       $scope.permission = {};
       //edit user
       $scope.editUser = function(){
           if($scope.formData){
               $http.put(baseConfig.serverHost + 'data/customerStatus/'+$scope.formData.id, $scope.formData).success(function(data){
                   if(data.error == false) {
                       toastr.success('数据编辑成功!');
                   }
               });
           }
       }
   }
})();
