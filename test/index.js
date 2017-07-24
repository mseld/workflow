var chaiHttp = require('chai-http');
var server = require('../server');
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

chai.use(chaiHttp);

/*
 * Test the /GET route
 */
describe('GET /discovery HLR', () => {
    it('it should GET a HLR by number', (done) => {
        var number = '201000525849';
        chai.request(server)
            .get('/discovery?numbers=' + number)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

/*
 * Test the /GET/:id route
 */
describe('GET /discovery/:numbers HLR', () => {
    it('it should GET a HLR by number', (done) => {
        var number = '201208335005';
        chai.request(server)
            .get('/discovery/' + number)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});