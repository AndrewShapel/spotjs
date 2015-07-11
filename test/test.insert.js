describe('Insert', function() {
  var href;
  var name;
  var media;
  var insertBefore;
  var stylesheet = 'content';

  before(function(done) {
    href = 'files/test.css';
    name = 'stylesheet';
    media = 'all';
    done();
  });

  after(function(done) {
    document.querySelector('style[title="' + name + '"]').remove();
    done();
  });

  describe('#addStylesheet()', function() {
    it('should create link and load stylesheet from href', function(done) {
      Spot.addStylesheet(href, name, media, insertBefore, function(link) {
        var link = document.querySelector('style[data-href="' + href + '"]');
        link.should.not.equal(null).and.an.instanceOf(Object);

        done();
      });
    });

    it('should verify an attributes from loaded link', function() {
      var link = document.querySelector('style[data-href="' + href + '"]');

      link.should.have.property('type', 'text/css');
      link.dataset.href.should.equal(href);
      link.should.have.property('title', name);
      link.should.have.property('media', media);
    });
  });

  describe('#addStylesheetRules()', function() {
    it('should create style tag and put stylesheet to it', function() {
      Spot.addStylesheetRules(stylesheet, href, name, media, insertBefore);

      var style = document.querySelector('style[title="' + name + '"]');
      style.should.not.equal(null).and.an.instanceOf(Object);
    });

    it('should verify an attributes from loaded style tag', function() {
      var style = document.querySelector('style[title="' + name + '"]');

      style.should.have.property('type', 'text/css');
      style.should.have.property('title', name);
      style.should.have.property('media', media);
      style.innerHTML.should.not.empty();
    });
  });
});
