angular.module("donateesApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    donatees: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/about", {
                templateUrl: "about.html",
                // controller: "ListController",
                resolve: {
                    // donatees: function(Contacts) {
                    //     return Contacts.getContacts();
                    // }
                }
            })
            .when("/new/donatee", {
                controller: "NewContactController",
                templateUrl: "donatee-form.html"
            })
            .when("/donatee/:donateeId", {
                controller: "EditContactController",
                templateUrl: "donatee.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/donatees").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding donatees.");
                });
        }
        this.createContact = function(donatee) {
            return $http.post("/donatees", donatee).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating donatee.");
                });
        }
        this.getContact = function(donateeId) {
            var url = "/donatees/" + donateeId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this donatee.");
                });
        }
        this.editContact = function(donatee) {
            var url = "/donatees/" + donatee._id;
            console.log(donatee._id);
            return $http.put(url, donatee).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this donatee.");
                    console.log(response);
                });
        }
        this.deleteContact = function(donateeId) {
            var url = "/donatees/" + donateeId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this donatee.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(donatees, $scope) {
        $scope.donatees = donatees.data;
    })
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveContact = function(donatee) {
            Contacts.createContact(donatee).then(function(doc) {
                var donateeUrl = "/donatee/" + doc.data._id;
                $location.path(donateeUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.donateeId).then(function(doc) {
            $scope.donatee = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.donateeFormUrl = "donatee-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.donateeFormUrl = "";
        }

        $scope.saveContact = function(donatee) {
            Contacts.editContact(donatee);
            $scope.editMode = false;
            $scope.donateeFormUrl = "";
        }

        $scope.deleteContact = function(donateeId) {
            Contacts.deleteContact(donateeId);
        }
    });