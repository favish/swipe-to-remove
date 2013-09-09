
'use strict';

angular.module('itemSwipe', ['ngTouch'])
  .directive('itemSwipe', ['$swipe', '$document', '$window', '$timeout',
    function($swipe, $document, $window, $timeout) {

    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {

      var startCoords, valid, pos, startIndex, $button, threeD;
      threeD = false;

      element.css({position : 'relative'});

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Absolute horizontal distance must be within tolerances.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = Math.abs(coords.x - startCoords.x);
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }
      function validMove(coords, element){
        return element.index() === startIndex ? true : false;
      }
      function fullSwipe(coords){
        return coords.x > element.parent().width()*(4/5) ? true : false;
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
          $button.show();
          scope.eliminateItem = $timeout(function() {
            $button.unbind('click');
            scope.proceed = false;
            return scope.$eval(attr.onRemove);
          }, 2200);
        }else{
          $button.hide();
          $timeout.cancel(scope.eliminateItem);
          updateElementPosition(0);
        }
      });

      $button = angular.element('<button></button')
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
          // if (validSwipe(endCoords) && fullSwipe(endCoords)) {
            // execute user defined callback
            scope.proceed = true;
            updateElementPosition($document.width() - element.width());
          }else {
            scope.proceed = false;
            updateElementPosition(0);
          }
          scope.$apply();
        }
      });

    };

  }]);
