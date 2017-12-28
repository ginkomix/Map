function Map() {
    this.yaMap;
    this.createMapFlag = false;
    var self = this;
    this.enterPress();
    this.createMap = function(cord) {
        ymaps.ready(init);

        function init () {
            self.createMapFlag = true;
            self.yaMap = new ymaps.Map('map', {

                center: [cord[0],cord[1]],
                zoom: 13,
                controls: ['zoomControl', 'typeSelector']
            });
            self.yaMap.events.add('actionend', self.showCenter);

            self.showCenter();
        } 
    }

    this.showCenter = function() {
        eb.trigger('cordChange',self.yaMap.getCenter());
    }

    this.findCity = function() {

        Promise.resolve()
            .then(function() {
            var text = document.querySelector('#findeInput').value;
            return  text;
        })
            .then(function(text){
            var myGeocoder = ymaps.geocode(text);
            myGeocoder.then(
                function (res) {
                    eb.trigger('moveCity',res.geoObjects.get(0).geometry.getCoordinates());
                });
        });
    }

    this.moveCity = function(cord) {
        self.yaMap.panTo(cord, {
            flying: 1
        });
    }
}


Map.prototype.sliceCord = function(str) {
    var arr = str.split(',');
    return arr;
}

Map.prototype.changeHach = function(cord) {
    window.location.hash = 'main='+cord[0]+','+cord[1];  
}

Map.prototype.changeButtonHref = function(cord) {
    document.querySelector('#buttonMain').setAttribute('href','#main='+cord[0]+','+cord[1]);
}

Map.prototype.enterPress = function() {
    var self =this;
   document.onkeyup = function (e) {
	    e = e || window.event;
	    if (e.keyCode === 13) {
	       self.findCity();
	    }
	    return false;
	}
 
}
var map = new Map();
eb.on('cordChange',map.changeButtonHref);
eb.on('cordChange',map.changeHach);
eb.on('moveCity',map.changeButtonHref);
eb.on('moveCity',map.changeHach);
eb.on('moveCity',map.moveCity);
document.querySelector('#findButton').addEventListener('click',map.findCity);
document.querySelector('#findButton').addEventListener('click',map.findCity)
