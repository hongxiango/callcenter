/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .service('httpRequest', httpRequest);

  /** @ngInject */
  function httpRequest($q, $http, $httpParamSerializer,$rootScope) {
      return function (_url, method, _params) {
          var defer = $q.defer();
          if(angular.uppercase(method) == "GET"){
              $http({
                  method: method,
                  url: _url,
                  params : _params || {},
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }).success(function (_data) {
                  defer.resolve(_data);
              }).error(function () {
                  defer.reject("提交失败!");
              });
          }else{
              $http({
                  method: method,
                  url:   _url,
                  data : _params || {},
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }).success(function (_data) {
                  defer.resolve(_data);
              }).error(function () {
                  defer.reject("提交失败!");
              });
          }

          return defer.promise;
      }

    return {
        httpRequest: httpRequest
    };
  }
})();