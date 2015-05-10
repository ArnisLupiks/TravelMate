angular.module('sample.addPosts', [
  'auth0',

])
.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
.controller('addPostCtrl',
            function HomeController($scope, $http, FileUploader, $filter, $location, auth){
              //shows user credentials
              $scope.auth = auth;
              // date pick option
              $scope.today = function() {
                $scope.dt = new Date();
                console.log("today button pressed");
              };
              $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.opened = true;
              };
              $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
              };
              $scope.formats = ['yyyy/MM/dd','dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
              $scope.format = $scope.formats[0];
              //location scope is empty
              //$scope.location = '';
              // on submit button do post and collect data
               $scope.submitForm = function() {
                      // check if location is set or not
                    /**  if($scope.location === ''){
                         alert('Directive did not update the location property in parent controller.');
                      } else {
                         //alert('Yay. Location: ' + $scope.location);
                      }*/
                      var formData = {
                      uid: auth.profile.user_id,
                      heading: $scope.heading,
                      content: $scope.content,
                      //location: $scope.location,
                      date: $scope.dt
                    };
                    console.log(formData);
                    $http({
                        url: "api/addPosts.php",
                        data: formData,
                        method: 'POST',
                        headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
                    }).success(function(data){
                        //if added information, it will log OK and redirect.
                        console.log("OK", data);
                        //redirect to main post page
                        $location.path("/");
                    }).error(function(err){"ERR", console.log(err)})
                };
                //reset form
                 $scope.master = {};
                 $scope.maste = "";
                 $scope.reset = function() {
                     $scope.form = angular.copy($scope.master);
                     $scope.dt = angular.copy($scope.master);
                     console.log("reset has been pressed");
                };

                $scope.uploader = new FileUploader();
                  //filter utitlity function
                  $scope.customArrayFilter = function (item){
                    return (item.postHeading.indexOf('it') != -1);
                };
                //add pictures
                 var uploader = $scope.uploader = new FileUploader({
                     url: 'api/uploadPic.php'
                 });

                 // FILTERS

                 uploader.filters.push({
                     name: 'imageFilter',
                     fn: function(item /*{File|FileLikeObject}*/, options) {
                         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                     }
                 });

                 // CALLBACKS

                 uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                     console.info('onWhenAddingFileFailed', item, filter, options);
                 };
                 uploader.onAfterAddingFile = function(fileItem) {
                     console.info('onAfterAddingFile', fileItem);
                 };
                 uploader.onAfterAddingAll = function(addedFileItems) {
                     console.info('onAfterAddingAll', addedFileItems);
                 };
                 uploader.onBeforeUploadItem = function(item) {
                     console.info('onBeforeUploadItem', item);
                 };
                 uploader.onProgressItem = function(fileItem, progress) {
                     console.info('onProgressItem', fileItem, progress);
                 };
                 uploader.onProgressAll = function(progress) {
                     console.info('onProgressAll', progress);
                 };
                 uploader.onSuccessItem = function(fileItem, response, status, headers) {
                     console.info('onSuccessItem', fileItem, response, status, headers);
                 };
                 uploader.onErrorItem = function(fileItem, response, status, headers) {
                     console.info('onErrorItem', fileItem, response, status, headers);
                 };
                 uploader.onCancelItem = function(fileItem, response, status, headers) {
                     console.info('onCancelItem', fileItem, response, status, headers);
                 };
                 uploader.onCompleteItem = function(fileItem, response, status, headers) {
                     console.info('onCompleteItem', fileItem, response, status, headers);
                 };
                 uploader.onCompleteAll = function() {
                     console.info('onCompleteAll');
                 };

                 console.info('uploader', uploader);
        });
