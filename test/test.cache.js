describe('Cache', function() {
  var name;
  var href;
  var media;
  var stylesheet;
  var expireHours;

  before(function(done) {
    name = 'stylesheet';
    href = 'files/test.css';
    media = 'all';
    stylesheet = 'content';
    expireHours = 1;

    done();
  });

  after(function(done) {
    localStorage.removeItem(name);
    done();
  });

  describe('#isLocalStorageSupports()', function() {
    it('should return true when the localStorage is support', function() {
      var isSupports = Spot.isLocalStorageSupports();
      isSupports.should.equal((window.hasOwnProperty('localStorage') && window.localStorage !== null));
    });
  });

  describe('#saveInLocalStorage()', function() {
    it('should caching content', function() {
      Spot.saveInLocalStorage(name, href, media, stylesheet, expireHours);

      var cache = localStorage.getItem(name);
      cache.should.not.equal(null);
    });
  });

  describe('#findInLocalStorage()', function() {
    it('should verify the cached content', function() {
      var cache = Spot.findInLocalStorage(name, href);
      cache.should.have.property('name', name);
      cache.should.have.property('href', href);
      cache.should.have.property('media', media);
      cache.should.have.property('stylesheet', stylesheet);
      cache.should.have.properties('timeStamp', 'expireStamp');
      cache.timeStamp.should.not.equal(cache.expireStamp);
    });

    it('should verify the expiration of cached content', function() {
      var cache = Spot.findInLocalStorage(name, href);
      var timeStamp = new Date(cache.timeStamp * 1);
      var expireStamp = new Date(cache.expireStamp * 1);

      timeStamp.should.not.equal(expireStamp);
      cache.expireStamp.should.equal(timeStamp.setHours(timeStamp.getHours() + expireHours).toString());
    });
  });
});
