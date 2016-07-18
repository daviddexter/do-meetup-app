rootApp.controller('index',['$scope','$http','$state','$mdBottomSheet','$mdToast',function($scope,$http,$state,$mdBottomSheet,$mdToast){
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/blackspace');
    $scope.allChat = [];

    socket.on('connect',function(){
        //console.log("connected js");
    });

    socket.on('exist',function(data){
        $mdToast.show($mdToast.simple()
             .textContent(data)
             .position('bottom')
         );
    });

    socket.on('notreg',function(data){
        $mdToast.show($mdToast.simple()
             .textContent(data)
             .position('bottom')
         );
    });

    socket.on('created',function(data){
        $scope.username = ''; $scope.lastname = '';
        $scope.firstname = ''; $scope.useremail = '';
        $state.go('index.home');
    });

    socket.on('added',function(data){
        $scope.qusername = '';  $scope.question = '';
        $state.go('index.home');
    });

    $scope.fetchAll = function (){
        //console.log('fetchings')
        socket.send('getquestions');
    }

    socket.on('allquestions',function(data){
        $scope.allque = []
        for (var i = 0; i < data.length; i++){
            $scope.allque.push(data[i]);
            $scope.$apply();
        }
    });



    $scope.addRegistration = function (){
        if($scope.username == undefined || $scope.firstname == undefined || $scope.lastname == undefined ||
        $scope.useremail == undefined){
             $mdToast.show($mdToast.simple()
                .textContent('Please provide all details')
                .position('bottom')

             );
        }else{
            var regData = {'uname':$scope.username,'fname':$scope.firstname,'lname':$scope.lastname,'uemail':$scope.useremail}
            socket.emit('register',regData)
        }
    }
    $scope.addQuestion = function () {
        if($scope.qusername == undefined || $scope.question == undefined){
            $mdBottomSheet.show({
              template: '<md-bottom-sheet><h2>Please provide all details</h2></md-bottom-sheet>'
            });
        }else{
            var qData = {'quname':$scope.qusername,'que':$scope.question}
            socket.emit('addquestion',qData)
        }
    }

}]);













