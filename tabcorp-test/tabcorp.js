var _ = require('underscore');

var CacheItem = function(k, v) {
    this.key = k;
    this.value = v;
};

var Cache = function(mItems) {

    this.cacheItems = [];
    this.maxItems = !mItems ? 3 : mItems;

    this.setCache = function(k, v) {
        var ci = new CacheItem(k,v);
        this.cacheItems.push(ci);

        if(this.cacheItems.length > this.maxItems) {
            this.cacheItems.splice(0,1);
        }
    };

    this.getCache = function(k) {

        var indexFound = -1;

        var ci = _.find(this.cacheItems, function (item, i){
            indexFound = i;
            return item.key == k;
        });

        if(ci) {
            this.cacheItems.splice(indexFound, 1);

            //because we access this cache - set it again (i.e push it to the end)
            this.setCache(ci.key, ci.value);
        }

        return ci;
    };
};

var c = new Cache(3);
c.setCache('A', 'asdads');
c.setCache('B', 'asdads');

c.getCache('A');

c.setCache('C', 'asdads');
c.setCache('D', 'asdads');

console.log(c.cacheItems);
