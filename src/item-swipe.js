
'use strict';

angular.module('itemSwipe', ['ngTouch'])
  .directive('itemSwipe', ['$swipe', '$document', '$window', '$timeout',
    function($swipe, $document, $window, $timeout) {

    return function(scope, element, attr) {

      var startCoords, pos, startIndex, $undoDiv, threeD;
      threeD = false;

      element.css({position : 'relative'});
      element.wrap('<div class="item-swipe-wrapper"></div>');

      function validMove(coords, element){
        return element.index() === startIndex ? true : false;
      }
      function fullSwipe(coords){
        return coords.x > element.parent().width()*(1/3) ? true : false;
      }
      function updateElementPosition(pos){
        if(threeD){
          element.css({
            '-o-transform' : 'translate(' + pos + 'px)',
            '-moz-transform' : 'translate(' + pos + 'px)',
            '-ms-transform' : 'translate(' + pos + 'px)',
            '-khtml-transform' : 'translate(' + pos + 'px)',
            '-webkit-transform' : 'translate(' + pos + 'px)',
          });
        }else{
          element.css('left', pos);
        }
      }

      scope.proceed = false;
      scope.$watch('proceed', function(val){
        if(val){
          $undoDiv.show();
          scope.eliminateItem = $timeout(function() {
            $undoDiv.unbind('click');
            scope.proceed = false;
            return scope.$eval(attr.onRemove);
          }, 2200);
        }else{
          $undoDiv.hide();
          $timeout.cancel(scope.eliminateItem);
          updateElementPosition(0);
          element.css('opacity', 1);
        }
      });

      $undoDiv = angular.element('<div></div>')
        .addClass('undo-div')
        .hide()
        .text('undo')
        .bind('click', function(){
          scope.proceed = false;
          scope.$apply();
        })
        .appendTo(element);

      $swipe.bind(element, {
        'start': function(coords) {
          startCoords = coords;
          startIndex = element.index();
          element.removeClass('moving');
        },
        'cancel': function() {
          valid = false;
          element.addClass('moving');
        },
        'move': function(coords) {
          element.css('opacity', 0.5);
          if(validMove(coords, element)){
            pos = coords.x - element.width()/2;
            updateElementPosition(pos);
            if(coords.x > $document.width()*2/3){

            }else{
              scope.proceed = false;
              scope.$apply();
            }
          }
        },
        'end': function(endCoords) {
          element.addClass('moving');
          if (fullSwipe(endCoords)) {
            scope.proceed = true;
            updateElementPosition($document.width());
          }else {
            scope.proceed = false;
            updateElementPosition(0);
          }
          scope.$apply();
        }
      });
    };
  }]);
