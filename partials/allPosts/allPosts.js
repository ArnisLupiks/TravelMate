angular.module('sample.allPosts', ['auth0'])
//controller

.factory('posts',function($http){
  return{
    list: function(callback){
      $http.get('api/getPosts.php').
        success(callback)
    },
    find: function(postID, callback){
      $http.get('api/getPosts.php').success(function(data){
        var post = data.filter(function(entry){
          return entry.postID === postID;
        })[0];
        callback(post);
      });
    },
    getLogProfile : function(picUsrId){
      return $http({
        url: 'api/getPostUPic.php',
        method: 'POST',
        data: picUsrId
      })
    },
    deleteLog : function(remLog){
      return $http({
        url: 'api/removeLog.php',
        method: 'POST',
        data: remLog
      })
    }
  };
})
.factory('addCom' ,function($http){
  return{
    addComments : function(commentData){
      return $http({
        url: 'api/addComments.php',
        method: 'POST',
        data: commentData
      })
    },
    allComments : function(postID){
      return $http({
        url: 'api/getComments.php',
        method: 'POST',
        data: postID
      })
    },
    removeComment : function(comID){
      return $http({
        url: 'api/removeComment.php',
        method: 'REMOVE',
        data: comID
      })
    }
  }
})
//displays all logs in grid view on main page
.controller('postCtrl', function HomeController (Flash, posts, $scope, $http, $filter, $location, auth){

        posts.list(function(posts){
          $scope.posts = posts;
            angular.forEach($scope.posts ,function(post){
              //get user id
              var picUsrId = {uid : post.uid };
              //get user information
              $scope.method = 'POST';
              $scope.url = 'api/getPostUPic.php';
              $http({method: $scope.method, url: $scope.url, data: picUsrId})
                .success(function(picdata, status){
                      //adds picture/name/surname to post object
                      console.log(status);
                    //  console.log(picdata);
                      post.picture = picdata[0];
                    //trow error if not successfully executed function
                    }).error(function(err){
                        "ERROR in getPostUPic", console.log(err)
                    });
            })
      });
        //optional -- order by date
        var orderBy = $filter('orderBy');
        $scope.order = function(predicate, reverse){
                $scope.posts = orderBy($scope.posts, predicate, reverse);
        };
        $scope.order ('-postDate',false);

        $scope.dateOption = {
                formatYear: 'yy',
                startingDay:1
        };
        $scope.formats = ['yyyy/MM/dd','ss-MMMM-yyyy','dd.MM.yyyy','shortDate'];
        $scope.format = $scope.formats[0];
        //reset form ********************************************
        $scope.master = {};
        $scope.maste = "";
        $scope.reset = function(){
                $scope.form = angular.copy($scope.master);
                $scope.dt = angular.copy($scope.master);
                console.log("reset has been pressed");
        };
  // popup dialog for post page ***************************
        $scope.openPopup = function(post){
                var newScope = $scope.$new();
                newScope.post = post;
                ngDialog.open({ template: 'partials/allPosts/post.html', className: 'ngdialog-theme-default', controller: 'postCtrl', scope: newScope});
                var lat = post.latitude;
                var long = post.longitude;
                var mid = post.postID;
                $scope.map = {center:{ latitude: lat, longitude: long}, zoom:15};

        $scope.markers = { key: mid, coords: {latitude :lat, longitude: long },icon: 'bower_components/angular-maps/example/assets/images.blue_marker.png',
                optimized:false,labelClass:"label"};
        };
        $scope.isSelected = function(section){
                return $scope.selected === section;
        };

  // add Heart to post
  $scope.count = function(post){
    console.log(post.postID);

    $scope.like = post.likes + 1;

    };

 //add favorite posts to users collection
    $scope.addToFavorit = function(post){

      var favoritData = {uid:auth.profile.user_id, postID:post.postID};
      $scope.method = 'POST';
      $scope.url = 'api/addToFavorit.php';
      $http({method: $scope.method, url: $scope.url, data: favoritData})
        .success(function(data, status){
              //adds picture/name/surname to post object
              var message = "<strong> "+auth.profile.name+"</strong> you have added to favorites <em>" + post.picture.username + " " + post.picture.surname + "</em> log";
              Flash.create('success', message, 'customAlert');
              console.log(status);
            console.log(data);
            //trow error if not successfully executed function
            }).error(function(err){
                "ERROR in getPostUPic", console.log(err)
            });
    };
})
// displays selected log from the list above
.controller('postDetailCtrl', function HomeController (Flash, posts, addCom, $rootScope,  uiGmapGoogleMapApi, $routeParams, $scope, $http, $filter, $location, auth){
        $scope.auth = auth;
        posts.find($routeParams.postID, function(post){
          $rootScope.post = post;
          $scope.post = post;
          //get comments
          var postID = {postID: post.postID};
          //show and refresh list of comments
          $scope.addData = function(){
            addCom.allComments(postID).success(function(data){
              $scope.allcoms = data;
              angular.forEach($scope.allcoms ,function(allcom){
                $scope.allcom = [];
                //setting variable wiwth member friend id
                var picUsrId = {uid : allcom.comUsrID };
                  posts.getLogProfile(picUsrId).success(function(picdata){
                    allcom.picture = picdata[0];
                  })
              });
            });
          };
          $scope.addData();
          // end of get comments
          $scope.map = {center: { latitude: post.latitude, longitude: post.longitude }, zoom: 14 };
            var picUsrId = {uid : post.uid };
            // ******* get user information ********
            posts.getLogProfile(picUsrId).success(function(picdata){
              post.picture = picdata[0];
            })
          });
        // *************** Add comment function **********************************
        $scope.addComment = function(){
          var commentData = {postID: $rootScope.post.postID, uid: $rootScope.post.uid, comUsrID: auth.profile.user_id, comContent: $('textarea[name=comment]').val()};
          addCom.addComments(commentData).success(function(data){
            //after comment is added update list in Comment page
            $scope.addData();
          });
        };
        // *************** Remove comment function *******************************
        $scope.deleteCom = function(allcom){
          var comID = {comID: allcom.id, comUsrID: auth.profile.user_id};
          addCom.removeComment(comID).success(function(data){
            console.log(comID);
            $scope.addData();
            console.log("server",data);
          });
        };
        // ************** Remove Log form user ***********************************
        $scope.removePost = function(post){
          var remLog = {postID: post.postID, uid: auth.profile.user_id};
          posts.deleteLog(remLog).success(function(data){
            //console.log("server says: ",data);
            $location.path("/");
          });
        };
// return to previous page
  $scope.back = function() {
    window.history.back();
  };
});
