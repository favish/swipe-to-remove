
'use strict';

angular.module('itemSwipe', ['ngTouch'])
  .directive('itemSwipe', ['$swipe', '$document', '$window', '$timeout',
    function($swipe, $document, $window, $timeout) {
      return {
        transclude: true,
        template: '<div style="position: relative">' +
                    '<div class="swiper" ng-style="swiperStyle" ng-transclude></div>' +
                    '<div class="undo-div" ng-style="undoStyle" ng-click="proceed = false">Undo</div>' +
                  '</div>',
        link: {
          post: function postLink(scope, iElement, iAttrs, controller) {
            var startCoords, threeD, $swiper;
            $swiper = angular.element('.swiper', iElement);
            scope.proceed = false;
            scope.undoStyle = {
              opacity: 0,
              width: '100%',
              position: 'absolute',
              left: '70%',
              top: '0',
            };
            scope.swiperStyle = {
              position: 'relative',
            }

            function fullSwipe(coords){
              return coords.x - startCoords.x > $swiper.width()*(1/3) ? true : false;
            }

            function cssPrefix(property, value){
              var vendors = ['', '-o-','-moz-','-ms-','-khtml-','-webkit-'];
              var styles = {};
              for (var i = vendors.length - 1; i >= 0; i--) {
                styles[vendors[i] + property] = value;
              }
              return styles;
            }

            function updateElementPosition(pos){
              if('threeD' in iAttrs){
                $swiper.css(cssPrefix('transform', 'translate(' + pos + 'px)'));
              }else{
                $swiper.css('left', pos);
              }
            }

            scope.$watch('proceed', function(val){
              if(val){
                scope.undoStyle.opacity = 1;
                scope.eliminateItem = $timeout(function() {
                  scope.proceed = false;
                  return scope.$eval(iAttrs.onRemove);
                }, 1220);
              }else{
                scope.undoStyle.opacity = 0;
                $timeout.cancel(scope.eliminateItem);
                updateElementPosition(0);
              }
            });

            $swipe.bind($swiper, {
              'start': function(coords) {
                startCoords = coords;
                scope.swiperStyle = {opacity: 0.5};
                scope.$apply();
              },
              'cancel': function() {
                scope.swiperStyle = cssPrefix('transition', 'all 0.2s ease-in-out');
                scope.swiperStyle.opacity = 1;
                scope.$apply();
              },
              'move': function(coords) {
                updateElementPosition(coords.x - startCoords.x);
              },
              'end': function(endCoords) {
                if (fullSwipe(endCoords)) {
                  scope.proceed = true;
                  updateElementPosition($document.width());
                }else {
                  scope.proceed = false;
                  updateElementPosition(0);
                }
                scope.swiperStyle = cssPrefix('transition', 'all 0.2s ease-in-out');
                scope.swiperStyle.opacity = 1;
                scope.$apply();
              }
            });
          }
        }
      };
    }]);
