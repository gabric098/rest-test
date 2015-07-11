var request = require('superagent');
var expect = require('expect.js');
var server = require('../main/apps/server');
var dbFixtures = require('./dbFixtures');

var instance;
before(function(done){
    dbFixtures.truncatePromotionsTable();
    instance = server.listen(3001);
    instance.on("listening", function() {
        done();
    })
});

after(function(done) {
    instance.close();
    done();
});

describe('promotions endpoint', function(){

    beforeEach(function(){
    });

    it('Should validate invalid fields', function(done){
        request
            .post('http://localhost:3001/v1/promotions')
            .send({
                name: "",
                worth_perc: "aa",
                priority: -1,
                start_date: null,
                end_date: ""
            })
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.status).to.equal(500);
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Server error");
                expect(res.body.data.description).to.equal("Something went wrong while fulfilling your request");

                //Name
                expect(res.body.data.code.errors[0].path).to.equal("name");
                expect(res.body.data.code.errors[0].type).to.equal("Validation error");
                expect(res.body.data.code.errors[0].message).to.equal("name can't be empty or longer than 255 chars.");

                //Worth perc
                expect(res.body.data.code.errors[1].path).to.equal("worth_perc");
                expect(res.body.data.code.errors[1].type).to.equal("Validation error");
                expect(res.body.data.code.errors[1].message).to.equal("worth_perc must be a valid integer.");

                //Priority perc
                expect(res.body.data.code.errors[2].path).to.equal("priority");
                expect(res.body.data.code.errors[2].type).to.equal("Validation error");
                expect(res.body.data.code.errors[2].message).to.equal("priority value must be beetween 1 and 10.");

                //start date
                expect(res.body.data.code.errors[3].path).to.equal("start_date");
                expect(res.body.data.code.errors[3].type).to.equal("Validation error");
                expect(res.body.data.code.errors[3].message).to.equal("start_date must be a valid date, use this format (2001-10-31T22:00:00.000Z)");

                //end date
                expect(res.body.data.code.errors[4].path).to.equal("end_date");
                expect(res.body.data.code.errors[4].type).to.equal("Validation error");
                expect(res.body.data.code.errors[4].message).to.equal("end_date must be a valid date, use this format (2001-10-31T22:00:00.000Z)");

                done();
            });
    });

    var testDate1 = dbFixtures.generateDateInterval(true);
    // happy path
    it('Should create a new promotion', function(done){
        request
            .post('http://localhost:3001/v1/promotions')
            .send({
                name: "Test Promotion 1",
                worth_perc: 51,
                priority: 3,
                start_date: testDate1.start_date,
                end_date: testDate1.end_date
            })
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.equal("Object created");
                done();
            });
    });

    it('Should return the just created promotion', function(done){
        request
            .get('http://localhost:3001/v1/promotions/1')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.body.status).to.equal("success");
                expect(res.body.data.length).to.equal(1);
                expect(res.body.data[0].id).to.equal(1);
                expect(res.body.data[0].worth_perc).to.equal(51);
                expect(res.body.data[0].priority).to.equal(3);
                expect(res.body.data[0].start_date).to.equal(testDate1.start_date);
                expect(res.body.data[0].end_date).to.equal(testDate1.end_date);
                done();
            });
    });


    it('Should return the list of 1 promotions', function(done){
        request
            .get('http://localhost:3001/v1/promotions')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.body.status).to.equal("success");
                expect(res.body.data.length).to.equal(1);
                done();
            });
    });

    it('Should not return inactive promotions', function(done){
        var fixtures = dbFixtures.createInactivePromotion();

        request
            .get('http://localhost:3001/v1/promotions')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.body.status).to.equal("success");
                res.body.data.forEach(function(val) {
                    expect(val).not.to.equal(fixtures.id);
                });
                done()
            });
    });


});