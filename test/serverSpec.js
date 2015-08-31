var request = require('supertest');
var expect = require('chai').expect;
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../server/server.js').server;
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });

  it('responds to database routes', function dbroutes(done) {
    request(server)
      .get('/unrated')
      .expect(100)
      .end(function(err, res) {
        console.log(res.body)
        expect(res.body).to.be.instanceof(Array);
        done();
      });
  })
  it('404 to nonexistant routes', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});