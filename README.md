Swipe to Remove
============

Built upon ngTouch's <a href="https://docs.angularjs.org/api/ngTouch/service/$swipe">$swipe()</a> service.
Leverages ngAnimate for animating addition and deletion of items.
jQuery requirement for css manipulation

Working plunkr demo <a href="http://plnkr.co/edit/5ezZJ3yFFWVQWypAgC4h?p=preview">here<a/>

To run the demo first install node and bower dependencies
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
in HTML
```
<div class="animate-repeat" ng-repeat="thing in things">
  <div class="test" item-swipe on-remove="removeThing(thing)">
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

in css

```
.moving {
  transition : all 0.2s ease-in-out
}
.undo-div{
  width: 100%;
  position: absolute;
  left: -100%;
}
```

Sponsered by <a href="http://www.austinpost.org">AustinPost.org</a>
