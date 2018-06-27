let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('River List', () => {
    it('it should GET a list of Rivers', done => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.metaData.dataLength.should.be.above(0);
                res.body.metaData.dataLength.should.be.eql(res.body.data.length);
                done();
        });
    });
});

describe('Individual River', () => {
    it('it should GET single rivers Information', done => {
        chai.request(server)
            .get('/taieri at outram')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.siteName.should.be.eql("taieri at outram");
                done();
        });
    });
});
