(function(){
  'use strict';

  angular.module('kytoneApp')
    .directive('myPosterPlace', myPosterPlace)
    .directive('scroll', scroll)
    .directive('titleUpdate', titleUpdate)
    .directive('volumeRegulator', volumeRegulator)
    .directive('playerStatus', playerStatus)
    .directive('crutch', crutch);

  function myPosterPlace() {
    return function(scope, element, attrs) {
      scope.$parent.elemReady = null;
      if (scope.$last) {
        scope.$parent.elemReady = true;
      }
      angular.element(element).find('img').on('load', function() {
        scope.$parent.$parent.posters.count -= 1;
        if (scope.$parent.$parent.posters.count === -10) {
          var dir = scope.$parent.$parent.$parent.$odd ? 'slickNext' : 'slickPrev'
          $(angular.element(element).parent().parent().parent()).slick(dir);
          angular.element(element).parent().parent().parent().removeClass('hidden');
        }
      });
    
    };
  }

  function scroll($timeout) {

    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        $timeout( function() {
          var elemWidth = angular.element(element)[0].clientWidth;
          var maxWitdh = $('#plPlace')[0].clientWidth;
          if(elemWidth > maxWitdh) {
            angular.element(element).addClass('track-scroll');
          }
        });
      }
    };
  }

  function titleUpdate(socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        socket.on('track', function(data) {
          if (!(data.artist && data.title)) {
            angular.element(element).find('p').text('Kytone Radio (c)');
          } else
          angular.element(element).find('p').text(data.artist + ' - ' + data.title);
        })
        $(element).liMarquee();
      }
    }
  }

  function volumeRegulator(localStorageService) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var volume = 50;
        if (localStorageService.isSupported && localStorageService.get('volume') !== null) {
          volume = localStorageService.get('volume');
        }
        $("#slider").slider({
          value  : volume,
          step   : 5,
          range  : 'min',
          animate: true,
          min    : 0,
          max    : 100,
          create: function() {
            $("#player")[0].volume = $("#slider").slider("value") / 100;
          },
          change : function(){
            var value = $("#slider").slider("value");
            localStorageService.set('volume', value);
            $("#player")[0].volume = (value / 100);
          }
      });

      //player volume slider [mouse wheel]
      $(".volume").on('mousewheel DOMMouseScroll', function(e) {
        var o = e.originalEvent;
        var delta = o && (o.wheelDelta || (o.detail && -o.detail));

        if ( delta ) {
          e.preventDefault();

          var step = $("#slider").slider("option", "step");
          step *= delta < 0 ? 1 : -1;
          $("#slider").slider("value", $("#slider").slider("value") + step);
        }
      });
      }
    }
  }

  function playerStatus($interval) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var reconnect;

        scope.stop = function() {
          $interval.cancel(reconnect);
        };

        scope.start = function() {
          reconnect = $interval(function() {
            console.log('reconncecting');
            element.load();
          },
          3000,
          10);
        }
        element.on('loadeddata', function() {
          scope.main.playerStatus = 'Ready';
          scope.stop();
          scope.$apply();
        });
        element.on('pause', function() {
          scope.main.playerStatus = 'Paused';
          scope.$apply();
        });
        element.on('playing', function() {
          scope.main.playerStatus = 'Playing';
          scope.$apply();
        });
        angular.element(element).children().on('error', function(error) {
          console.log('source error: ', error);
        })
        element.on('error', function(error) {
          scope.main.playerStatus = 'Ups, error';
          console.log('error: ', error);
          console.log(error.target.error);
          element.load();
          scope.$apply();
        });

        element.on('suspend', function() {
          scope.main.playerStatus = 'Reconnecting...'
          scope.start();
          scope.$apply();
        });
        element.on('ended', function() {
          scope.main.playerStatus = 'Reconnecting...'
          scope.start();
          scope.$apply();
        });
      }
    }
  }

  function crutch() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        attr.$set('src', attr.src + '?nocache=' + Math.floor(Math.random()*1000000).toString());
        console.log(attr.src);
      }
    }
  }
})();

