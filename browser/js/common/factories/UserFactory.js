'use strict';

app.factory('UserFactory', function($http) {

    let UserFactory = {};
    const path = 'api/users';
    let formatData = (res) => res.data;

    UserFactory.addPlayer = function(data) {
        return $http.post(path, data)
            .then(formatData);
    };

    return UserFactory;

});
