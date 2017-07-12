/**
 * @author v.lugovksy
 * created on 16.12.2015
 * @deprecated
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.organization')
      .directive('selectAsync', selectAsync);

  /** @ngInject */
  function selectAsync($http,baseConfig,$timeout) {
      return {
          restrict: 'A',
          scope: {},
          require: "?^ngModel",
          link: function ($scope, $element, $attrs, ngModel) {

              $http({url:baseConfig.serverHost + $attrs.selectAsync,method:"get"})
                  .success(function (results) {
                      var data = [];
                      if (angular.toJson(results).indexOf("data") >= 0) {
                          if(angular.toJson(results.data).indexOf("dataList") >= 0){
                              data = results.data.dataList;
                          }else{
                              data = results.data;
                          }
                      }
                      var _options = '<option value="0">0.空</option>';
                      var _length = data.length;
                      for (var i = 0; i < _length; i++) {
                          if(angular.isUndefined(data[i].username))
                          { _options += '<option value="' + data[i].id + '">' + data[i].id +"."+  data[i].name + '</option>';}
                          else
                          { _options += '<option value="' + data[i].id + '">' + data[i].id +"."+  data[i].username + '</option>';}
                      }
                      $element.html(_options);
                      $element.selectpicker('refresh');
                      $element.selectpicker("val",ngModel.$viewValue);
                  });
          }
      }
  };

})();