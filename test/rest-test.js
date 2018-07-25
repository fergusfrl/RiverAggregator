let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index").app;
let should = chai.should();

chai.use(chaiHttp);

describe("River List", () => {
    it("it should GET a list of Rivers", done => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.metaData.dataLength.should.be.above(0);
                res.body.metaData.dataLength.should.be.eql(
                    res.body.data.length
                );
                done();
            });
    });
});

/*
describe('Individual River Data', () => {
    it('it should GET single rivers information', done => {
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

describe('Historic Individual River Data', () => {
    it('it should GET single rivers historic information', done => {
        chai.request(server)
            .get('/taieri at outram/history')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.metaData.siteName.should.be.eql("taieri at outram");
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.above(0);
                res.body.data.length.should.be.below(1001);
                done();
        });
    });
});
*/
