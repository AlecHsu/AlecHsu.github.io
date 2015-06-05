app.controller('MainController', ['$scope', function($scope) { 
  $scope.title = 'Alec';
  $scope.promo = 'All pass';
  $scope.products = [
  	{
  		name: "工程數學",
  		price: 199,
  		picClass: "icon big rounded color1 fa-cloud",
      date: new Date('2015','05', '10'),
      likes: 0,
      dislikes: 0
  	},
  	{
  		name: "材料力學",
  		price: 299,
  		picClass: "icon big rounded color9 fa-desktop",
      date: new Date('2015','05', '11'),
      likes: 0,
      dislikes: 0
  	},
  	{
  		name: "動力學",
  		price: 99,
  		picClass: "icon big rounded color6 fa-rocket",
      date: new Date('2015','05', '12'),
      likes: 0,
      dislikes: 0
  	}
  ]; 
  $scope.minusOne = function(i){
    $scope.products[i].dislikes += 1;
  };
  $scope.plusOne = function(i){
    $scope.products[i].likes += 1;
  };
}]);