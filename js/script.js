function Map() {

}
Map.prototype.createMap = function(x,y) {
    Promise.resolve(function(){
        document.querySelector('');
    })
        .then(function(){
              var yaMap;
              ymaps.ready(init);
    function init () {

        yaMap = new ymaps.Map('map', {

            center: [55.4862, 28.8066],
            zoom: 13,
            controls: ['zoomControl', 'typeSelector']
        });
        var showCenter = function() {
            console.log('\n' + 'Center: ' + yaMap.getCenter().join(' - '));
        }
        yaMap.events.add('actionend', showCenter);
        showCenter();
    } 
});

}
var map = new Map();
map.createMap();








