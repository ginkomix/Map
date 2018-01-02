function Map() {
    this.yaMap;
    this.createMapFlag = false;
    var self = this;
    this.enterPress();

    this.outputSave('history','history-chande-block');

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

    this.history = function() {
        Promise.resolve()
            .then(function() {
            return document.querySelector('#findeInput').value;
        })
            .then(function(text) {
            self.addHistoryHtml(text);
            var objectSave = {
                '0':text                
            };
            self.save('history',objectSave,5);
        });
    }
}

Map.prototype.sliceCord = function(str) {
    var arr = str.split(',');
    return arr;
}



Map.prototype.save = function(where,text,size) {
    var sObj;
    var storageText =JSON.parse(localStorage.getItem(where));
    var saveObj = {};
    if(!storageText)
    {
        storageText = text;
    }else {
        for(var key in storageText) {
            var num = parseInt(key)+1;
            saveObj[num] = storageText[key];
            if((size-1) === num) {
                break;
            }
        }
        Object.assign(saveObj,text);
    }
    var sObj = JSON.stringify(saveObj);
    localStorage.setItem(where,sObj);
}

Map.prototype.outputSave = function(where,block) {
    var text = JSON.parse(localStorage.getItem(where));
    var blockOut = document.querySelector('.'+block);
    for(var key in text) {
        var p = document.createElement('p');
        p.innerHTML = text[key];
        blockOut.appendChild(p);
    }
}

Map.prototype.addHistoryHtml = function(text) {
    var historyP = document.querySelectorAll('.history-chande-block p');
    var block = document.querySelector('.history-chande-block');
    if(historyP.length>4) {
        historyP[4].remove();
    }
    var p = document.createElement('p');
    p.innerHTML = text;
    var first = block.firstChild;
    block.insertBefore(p,first);
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
eb.on('moveCity',map.history);
document.querySelector('#findButton').addEventListener('click',map.findCity);
document.querySelector('#findButton').addEventListener('click',map.findCity)
