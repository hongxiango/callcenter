/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.dataconfig', [])
    .config(routeConfig)

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider ) {
    $stateProvider
        .state('dataconfig', {
          url: '/dataconfig',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: '数据配置',
          sidebarMeta: {
            icon: 'ion-gear-a',
            order: 300,
          },
        }).state('dataconfig.customer', {
          url: '/customer',
          templateUrl: 'app/pages/dataconfig/customer/customer.html',
          title: '客户字段配置',
           controller: 'CustomerPageCtrl',
           sidebarMeta: {
            order: 0,
          },
    });
    $urlRouterProvider.when('/dataconfig','/dataconfig/customer');
  }
})();
