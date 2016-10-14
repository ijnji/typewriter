'use strict';

app.factory('UserFactory', function($http) {

    let UserFactory = {};
    const path = 'api/users';
    let formatData = (res) => res.data;

    UserFactory.addPlayer = function(data) {
        return $http.post(path, data)
            .then(formatData);
    };

    UserFactory.getAll = function(){
        return $http.get(path)
            .then(formatData)
    };
    UserFactory.getById = function(id){
        return $http.get(`${path}/${id}`)
            .then(formatData)
    }
    return UserFactory;

});
