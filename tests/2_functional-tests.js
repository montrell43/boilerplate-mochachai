const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=Taurus')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Taurus');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ surname: "Colombo" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Cristoforo');
          assert.equal(res.body.surname, 'Colombo');
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ surname: "da Verrazzano" })
        .end(function (err, res) {
      assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');

      done();
        })
    });
  });
});

const Browser = require('zombie');
Browser.site = 'https://boilerplate-mochachai-9cb7.onrender.com'; // your deployed app
const browser = new Browser();

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);

  suiteSetup(function(done) {
    browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {

    // ✅ #5 — Submit Colombo
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.visit('/', function () {
        browser.fill('surname', 'Colombo').then(() => {
          browser.pressButton('submit', function () {
            browser.assert.success(); // HTTP 200
            browser.assert.text('span#name', 'Cristoforo');
            browser.assert.text('span#surname', 'Colombo');
            browser.assert.elements('span#dates', 1);
            done();
          });
        });
      });
    });

    // ✅ #6 — Submit da Verrazzano
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.visit('/', function () {
        browser.fill('surname', 'Vespucci').then(() => {
          browser.pressButton('submit', function () {
            browser.assert.success(); // HTTP 200
            browser.assert.text('span#name', 'Amerigo');
            browser.assert.text('span#surname', 'Vespucci');
            browser.assert.elements('span#dates', 1);
            done();
          });
        });
      });
    });

  });
});
