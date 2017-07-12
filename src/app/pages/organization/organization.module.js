/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.organization', [])
    .config(routeConfig)

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider ,paginationTemplateProvider) {
      paginationTemplateProvider.setPath('app/pages/organization/tpl/dirPagination.tpl.html');
    $stateProvider
        .state('organization', {
          url: '/organization',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: '组织机构',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 300,
          },
        }).state('organization.character', {
          url: '/character',
          templateUrl: 'app/pages/organization/character/character.html',
          title: '角色管理',
           controller: 'CharacterPageCtrl',
           sidebarMeta: {
            order: 0,
          },
        }).state('organization.department', {
          url: '/department',
          templateUrl: 'app/pages/organization/department/department.html',
          title: '部门管理',
          controller: 'DepartmentPageCtrl',
          sidebarMeta: {
            order: 100,
          },
        }).state('organization.member', {
        url: '/smart',
        templateUrl: 'app/pages/organization/member/member.html',
        title: '用户管理',
        controller: 'MemberPageCtrl',
        sidebarMeta: {
            order: 200,
        },
    });
    $urlRouterProvider.when('/organization','/organization/character');
  }
})();
