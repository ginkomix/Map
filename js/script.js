function Map() {
    this.yaMap;
    this.createMapFlag = false;
    var self = this;
    this.enterPress();

    this.outputSave('history','history-chande-block');

    this.outputSave('favorite','favorite-chande-block');

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

    this.favorite = function() {

        Promise.resolve()
            .then(function() {
            return self.yaMap.getCenter();
        })
            .then(function(text) {
            var num = text;
            num[0] = num[0].toFixed(7);
            num[1] = num[1].toFixed(7);
            var objectSave = {
                '0':num                
            }; 
            self.save('favorite', objectSave,0);
        })
            .then(function() {
            self.outputSave('favorite','favorite-chande-block');
        });

    }

    this.delItem = function(event) {
        var target = event.target;
        if(target.tagName!='BUTTON') {
            return;
        }
        Promise.resolve()
            .then(function() {
            self.removeItemFromStorage('favorite',target.className);
        })
            .then(function() {
            self.outputSave('favorite','favorite-chande-block');
        });
    }
}

Map.prototype.XHR = function(cord) {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('GET', 'http://cors-proxy.htmldriven.com/?url=https://api.darksky.net/forecast/41b2362125a88e95e5d8522aa7a1a7d1/'+cord, true);
    xhr.onload = function() {
        var arr = JSON.parse(this.responseText);
        var event = JSON.parse(str, function(key, value) {
            if (key == 'date') return new Date(value);
            return value;
        });
        console.log(arr.body[0]);


    }
    xhr.send();
}

Map.prototype.removeItemFromStorage = function(where,link) {
    return new Promise(function(resolve) {
        var storageText =JSON.parse(localStorage.getItem(where));
        delete storageText[link];
        var arr = [],storageObj = {};
        for(var i in storageText) {
            arr.push(storageText[i]);
        }
        for(var i= 0;i<arr.length;i++) {
            storageObj[i] = arr[i];
        }
        var sObj = JSON.stringify(storageObj);
        localStorage.setItem(where,sObj);
        resolve();
    });
}

Map.prototype.sliceCord = function(str) {
    var arr = str.split(',');
    return arr;
}

Map.prototype.moveCord = function(event) {
    var target = event.target;
    if(target.tagName!='A') {
        return;
    }
    var arr =target.getAttribute('href').slice(6).split(',');
    arr[0]=parseFloat(arr[0]);
    arr[1]=parseFloat(arr[1]);
    eb.trigger('changeHach',arr);
}

Map.prototype.save = function(where,text,size) {

    var sObj;
    var storageText =JSON.parse(localStorage.getItem(where));
    var saveObj = {};
    if(!storageText)
    {
        saveObj = text;
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
    blockOut.innerHTML = '';
    for(var key in text) {
        if(where === 'favorite') {
            var p = document.createElement('p'),
                a = document.createElement('a'),
                button = document.createElement('button');
            button.innerHTML = 'del';
            button.className = key;
            a.innerHTML = text[key];
            a.setAttribute('href','#main='+text[key][0]+','+text[key][1]);
            p.appendChild(a);
            p.appendChild(button);
            blockOut.appendChild(p);
        }
        if(where === 'history')  {
            var p = document.createElement('p');
            p.innerHTML = text[key];
            blockOut.appendChild(p);
        }
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
eb.on('cordChange',map.XHR);
eb.on('changeHach',map.moveCity);
eb.on('changeHach',map.changeButtonHref);
eb.on('changeHach',map.XHR);
eb.on('moveCity',map.changeButtonHref);
eb.on('moveCity',map.changeHach);
eb.on('moveCity',map.moveCity);
eb.on('moveCity',map.history);
eb.on('moveCity',map.XHR);
document.querySelector('#findButton').addEventListener('click',map.findCity);
document.querySelector('.favorite-chande-block').addEventListener('click',map.moveCord);
document.querySelector('.favorite').addEventListener('click',map.favorite);
document.querySelector('.favorite-chande-block').addEventListener('click',map.delItem);




































