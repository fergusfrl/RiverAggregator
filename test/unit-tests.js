let chai = require("chai");
let chaiHttp = require("chai-http");
let index = require("../index");
let moment = require("moment");
let should = chai.should();

chai.use(chaiHttp);

describe("Standardised Dates", () => {
    it("it should parse dates", done => {
        index
            .standardiseDate(
                "2018-06-01 07:46am",
                "YYYY-MM-DD HH:mma",
                null,
                null,
                null
            )
            .should.be.eql("01/06/2018 7:46am");
        done();
    });
    it("it should parse dates wrapped in html", done => {
        var date = moment().format("DD/MM/YYYY");
        index
            .standardiseDate("<html>7:46am</html>", "", null, null, null)
            .should.be.eql(date + " 8:46am");
        done();
    });
});
