Swipe to Remove
============

Built upon ngTouch's <a href="https://docs.angularjs.org/api/ngTouch/service/$swipe">$swipe()</a> service.
Leverages ngAnimate for animating addition and deletion of items.
jQuery requirement for css manipulation

Working plunkr demo <a href="http://plnkr.co/edit/5ezZJ3yFFWVQWypAgC4h?p=preview">here<a/>

Includes a yeoman generated demo for local testing
```
cd demo
npm install
bower install
```
run the server
```
grunt server
```

Usage
in HTML, use the item-swipe attribute in your ng-repeat and set the on-remove attribute to the appropriate method
```
<div class="animate-repeat" ng-repeat="thing in things">
  <div item-swipe on-remove="removeThing(thing)">
    {{thing.name}}
  </div>
</div>
```

Handle remove event in the controller however you like
```
$scope.removeThing = function(thing){
  $scope.things.splice($scope.things.indexOf(thing), 1);
};
```

Styling
".swiper" is provided on the element to be swiped
".undo-div" is provided on the element that temporarily replaces the swiper element

The ng-repeat should be wrapped in a container to prevent the animation from extending the page width:
```
.container {
  zoom: 1;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
```

Sponsered by <a href="http://www.austinpost.org">AustinPost.org</a>
