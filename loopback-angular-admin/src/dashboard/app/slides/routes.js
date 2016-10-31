'use strict'
import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'

angular
  .module('com.module.slides.routes', [])
  .config(($stateProvider) => $stateProvider
    .state('app.slides', {
      abstract: true,
      url: '/slides',
      templateUrl: templateUrlMain,
    })
    .state('app.slides.list', {
      url: '',
      templateUrl: templateUrlList,
      controllerAs: 'ctrl',
      controller: function listCtrl (slides) {
        this.slides = slides.reduce((prev, cur) => {
          if (prev[cur.outerIndex]) {
            prev[cur.outerIndex].push(cur)
          } else {
            prev[cur.outerIndex] = [cur]
          }
          return prev
        }, {})

        this.sortableOptions = {


          itemMoved: (event) => {
            console.log(event, this)
          },
          orderChanged: (event) => {
            console.log(event, this)
          },

        }
      },
      resolve: {
        slides: (SlidesService) => SlidesService.getSlides(),
      },
    })
    .state('app.slides.add', {
      url: '/add',
      templateUrl: templateUrlForm,
      controllerAs: 'ctrl',
      controller: function addCtrl ($state, SlidesService, slide) {
        this.slide = slide
        this.formFields = SlidesService.getFormFields()
        this.formOptions = {}
        this.submit = () => SlidesService.upsertSlide(this.slide).then(() => $state.go('^.list'))
      },
      resolve: {
        slide: () => {},
      },
    })
    .state('app.slides.edit', {
      url: '/:id/edit',
      templateUrl: templateUrlForm,
      controllerAs: 'ctrl',
      controller: function editCtrl ($state, SlidesService, slide) {
        this.slide = slide
        this.formFields = SlidesService.getFormFields()
        this.formOptions = {}
        this.submit = () => SlidesService.upsertSlide(this.slide).then(() => $state.go('^.list'))
      },
      resolve: {
        slide: ($stateParams, SlidesService) => SlidesService.getSlide($stateParams.id),
      },
    })
    .state('app.slides.view', {
      url: '/:id',
      templateUrl: templateUrlView,
      controllerAs: 'ctrl',
      controller: function viewCtrl (slide) {
        this.slide = slide
      },
      resolve: {
        slide: ($stateParams, SlidesService) => SlidesService.getSlide($stateParams.id),
      },
    })
    .state('app.slides.delete', {
      url: '/:id/delete',
      template: '',
      controllerAs: 'ctrl',
      controller: ($state, SlidesService, slide) => SlidesService.deleteSlide(slide.id,
        () => $state.go('^.list'),
        () => $state.go('^.list')),
      resolve: {
        slide: ($stateParams, SlidesService) => SlidesService.getSlide($stateParams.id),
      },
    })
  )
