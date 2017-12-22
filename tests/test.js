var should = require('should');
var app = require('../app');
var request = require('supertest');
var nock = require('nock');



/*
Test Case to check the Vehicle Info Services   
*/
it("should respond with vehicle's vin nummber, Color,Number of doors, Drive Train", function(done) {

    var api = nock("http://gmapi.azurewebsites.net")
    .post("/getVehicleInfoService", {
      id:'1234',responseType:'JSON'
    })
    .reply(200,{
      "service": "getVehicleInfo",
      "status": "200",
      "data": {
        "vin": {
          "type": "String",
          "value": "999999999"
        },
        "color": {
          "type": "String",
          "value": "Metallic Silver"
        },
        "fourDoorSedan": {
          "type": "Boolean",
          "value": "False"
        },
        "twoDoorCoupe": {
          "type": "Boolean",
          "value": "True"
        },
        "driveTrain": {
          "type": "String",
          "value": "v8"
        }
      }
    });

    request(app)
      .get('/vehicles/1234')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        res.body.should.have.property('vin', '999999999');
        res.body.should.have.property('color', 'Metallic Silver');
        res.body.should.have.property('Door Count', 2);
        res.body.should.have.property('driveTrain', 'v8');
        done();
      });
  });





/*
Test Case to check the Vehicle Security 
*/






it('should respond with Array containing the List of doors and boolean values indicating if those doors are locked', function(done) {

    var api = nock("http://gmapi.azurewebsites.net")
    .post("/getSecurityStatusService", {
      id:'1234',responseType:'JSON'
    })
    .reply(200,{
     "service": "getSecurityStatus",
     "status": "200",
     "data": {
        "doors": {
        "type": "Array",
        "values": [{
              "location": {
              "type": "String",
              "value": "frontLeft"
              },
              "locked": {
              "type": "Boolean",
              "value": "False"
              }
          },
          {
          "location": {
          "type": "String",
          "value": "frontRight"
          },
          "locked": {
          "type": "Boolean",
          "value": "True"
          }
        }
      ]
    }
  }
  });

    request(app)
      .get('/vehicles/1234/doors')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        res.body[0].should.have.property('location', 'frontLeft');
        res.body[0].should.have.property('locked', false);
        res.body[1].should.have.property('location', 'frontRight');
        res.body[1].should.have.property('locked', true);
        done();
      });
  });




/*
Test Case to check the Vehicle Fuel Percentage  
*/


it('should respond with the percent of fuel left in the tank', function(done) {

    var api = nock("http://gmapi.azurewebsites.net")
    .post("/getEnergyService", {
      id:'1234',responseType:'JSON'
    })
    .reply(200,{
    "service": "getEnergyService",
  "status": "200",
  "data": {
    "tankLevel": {
      "type": "Number",
      "value": "30"
    },
    "batteryLevel": {
      "type": "Null",
      "value": "null"
    }
  }
  });

    request(app)
      .get('/vehicles/1234/fuel')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        res.body.should.have.property('percent', 30);
        done();
      });
  });





/*
Test Case to check the Vehicle Battery Percentage  
*/





it('should respond with percent of battery left', function(done) {

    var api = nock("http://gmapi.azurewebsites.net")
    .post("/getEnergyService", {
      id:'1235',responseType:'JSON'
    })
    .reply(200,{
    "service": "getEnergyService",
  "status": "200",
  "data": {
    "tankLevel": {
      "type": "Number",
      "value": "null"
    },
    "batteryLevel": {
      "type": "Null",
      "value": "10"
    }
  }
  });

    request(app)
      .get('/vehicles/1235/battery')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        res.body.should.have.property('percent', 10);
        done();
      });
  });





/*
Test Case to post the action on to the GMServer and get back the status report
*/




it('should respond with status confirming the action performed on the car', function(done) {

    var api = nock("http://gmapi.azurewebsites.net", {
      reqheaders : {
        'Content-Type': 'application/json'
      }
    })
    .post("/actionEngineService", {
      id:'1234',
      command:'START_VEHICLE',
      responseType:'JSON'
    })
    .reply(200,{
     "service": "actionEngine",
     "status": "200",
     "actionResult": {
     "status": "FAILED"
  }
  });

    request(app)
      .post('/vehicles/1234/engine')
      .set('Content-type', 'application/json')
      .send({'action': 'START'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        res.body.should.have.property('status', 'error');
        done();
      });
  });





