RowData = new Mongo.Collection('rowdata');
if (Meteor.isClient) {
    Meteor.startup(function () {
        GoogleMaps.load();
    });

    Template.body.helpers({
        exampleMapOptions: function () {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                return {
                    center: new google.maps.LatLng(22.30522, 70.77932),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT}
                };
            }
        }
    });
    Meteor.subscribe('getMyCounters');
    Template.body.onCreated(function () {
        // We can use the `ready` callback to interact with the map API once the map is ready.
        GoogleMaps.ready('exampleMap', function (map) {
            RowData.find().observe({
                added: function (document) {
                    var allCoords = RowData.find();
                    var pointsArr = new Array();
                    allCoords.forEach(function (coord) {
                        var latlng = new google.maps.LatLng(coord.lat, coord.lng);
                        pointsArr.push(latlng);
                    });
                    var drawpath = new google.maps.Polyline({
                        path: pointsArr,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        map: map.instance
                    });
                }
            });
        });
    });
}
if (Meteor.isServer) {
    Meteor.publish('getMyCounters', function () {
        return RowData.find();
    });
}
