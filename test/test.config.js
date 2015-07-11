describe('Config', function() {
  var config;

  before(function(done) {
    config = {
		  baseUrl: 'files',
		  stylesheets: {
		    'stylesheet': 'test.css',
        'another-stylesheet': 'path/to/another-stylesheet.css'
		  },
		  options: {
		    'stylesheet': {
		      'name': 'stylesheet',
          'media': 'all',
          'expireHours': 2
		    },
        'another-stylesheet': {
          'name': 'another-stylesheet',
          'media': 'device-width(320px)',
          'expireHours': 3
        }
		  }
		};

    done();
  });

  after(function(done) {
    Spot.config = {};
    done();
  });

  describe('#configure()', function() {
    it('should load config of stylesheets', function() {
      Spot.configure(config);
      Spot.config.baseUrl.should.be.not.empty().and.an.instanceOf(String);
      Spot.config.stylesheets.should.be.not.empty().and.an.instanceOf(Object);
    });

    it('should verify a hrefs of loaded config', function() {
      Spot.config.stylesheets.should.have.properties('stylesheet', 'another-stylesheet');
      Spot.config.stylesheets['stylesheet'].href.should.equal(config.baseUrl + config.stylesheets['stylesheet']);
      Spot.config.stylesheets['another-stylesheet'].href.should.equal(config.baseUrl + config.stylesheets['another-stylesheet']);
    });

    it('should verify a options of loaded config', function() {
      Spot.config.stylesheets['stylesheet'].options.should.have.property('name', config.options['stylesheet'].name);
      Spot.config.stylesheets['stylesheet'].options.should.have.property('media', config.options['stylesheet'].media);
      Spot.config.stylesheets['stylesheet'].options.should.have.property('expireHours', config.options['stylesheet'].expireHours);

      Spot.config.stylesheets['another-stylesheet'].options.should.have.property('name', config.options['another-stylesheet'].name);
      Spot.config.stylesheets['another-stylesheet'].options.should.have.property('media', config.options['another-stylesheet'].media);
      Spot.config.stylesheets['another-stylesheet'].options.should.have.property('expireHours', config.options['another-stylesheet'].expireHours);
    });
  });
});
