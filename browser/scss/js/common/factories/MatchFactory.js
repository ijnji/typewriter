'use strict';

app.factory('MatchFactory', function($http) {

    let MatchFactory = {};
    const path = 'api/matches';
    let formatData = (res) => res.data;

    MatchFactory.getAllForUser = function(id) {
        return $http.get(`${path}/user/${id}`)
            .then(formatData)
    };

    MatchFactory.getAll = function(){
        return $http.get(path)
            .then(formatData)
    };

    return MatchFactory;

});
