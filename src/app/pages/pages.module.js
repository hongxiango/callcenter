/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'angularUtils.directives.dirPagination',
    'LocalStorageModule',
    'BlurAdmin.organization',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.ui',
    'BlurAdmin.pages.components',
    'BlurAdmin.pages.form',
   // 'BlurAdmin.pages.tables',
   // 'BlurAdmin.pages.charts',
    'BlurAdmin.pages.maps',
    'BlurAdmin.pages.profile',
  ])
      .config(routeConfig)
      .factory('redirectInterceptor', redirectInterceptor)
      .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.interceptors.push('redirectInterceptor');
      }])
    //请求拦截 用于登录超时
    function redirectInterceptor($q, $location) {
        return {
            response: function (response) {
                return response;
            },
            request: function(config) {
                // 成功的请求方法
                return config;
            },
            requestError: function(rejection) {
                return response;
            },
            responseError: function(rejection) {
                if(rejection.status == 401){
                    window.location.href="auth.html"
                    alert("身份过期或失效，请重新登录！")
                }else if(rejection.status == 403){
                    window.location.href="auth.html"
                    alert("当前模块您的权限不足，请联系管理员！")
                }
                else if(rejection.status == 500){
                    alert("数据处理发生错误,请检查后操作！")
                }

                return rejection;

            }
        }
    }


  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: 'auth.html',
        blank: true
      }, {
        title: 'Sign Up',
        fixedHref: 'reg.html',
        blank: true
      }, {
        title: 'User Profile',
        stateRef: 'profile'
      }, {
        title: '404 Page',
        fixedHref: '404.html',
        blank: true
      }]
    });
    baSidebarServiceProvider.addStaticItem({
      title: 'Menu Level 1',
      icon: 'ion-ios-more',
      subMenu: [{
        title: 'Menu Level 1.1',
        disabled: true
      }, {
        title: 'Menu Level 1.2',
        subMenu: [{
          title: 'Menu Level 1.2.1',
          disabled: true
        }]
      }]
    });
  }

})();
