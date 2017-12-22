var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var gm_uri = "http://gmapi.azurewebsites.net";



/*
To get the Vehicle Info Services   
*/

router.get('/vehicles/:id', function(req, res) {
	request.post(
		gm_uri+'/getVehicleInfoService',
		{json:{id:req.params.id,responseType:'JSON'}},
		
		function(error, response, body){
			 if (!body || error) return res.sendStatus(400);
			 var doors=0;
			 if(body.data.fourDoorSedan.value=='True'){
			 	doors=4; 
			 }
			 else{
			 	doors=2;
			 }
			 var a ={};
			 a["vin"]         = body.data.vin.value;
			 a["color"]       = body.data.color.value;
			 a["Door Count"]	      = doors;
			 a["driveTrain"]  = body.data.driveTrain.value;	
			res.json(a);
			
		}

		);
});





/*
To get the Vehicle Security   
*/


router.get('/vehicles/:id/doors', function(req, res) {
	request.post(
		gm_uri+'/getSecurityStatusService',
		{json:{id:req.params.id,responseType:'JSON'}},
		
		function(error, response, body){
			var acquiredGM = body;
			 if (!body || error) return res.sendStatus(400);
			 
			 var s = body.data.doors.values;
			 var a = [];
				for(var i=0;i<s.length;i++){
				var b ={};
					b["location"] = s[i].location.value;
					var x = s[i].locked.value;
					var z = false;
					if(x=="True"){
						z = true;
					}
					b["locked"]   = z;
					a = a.concat(b);
			}
			res.json(a);
			
		});

  
});






/*
To get the Vehicle Fuel Percentage 
*/


router.get('/vehicles/:id/fuel', function(req, res) {
	request.post(
		gm_uri+'/getEnergyService',
		{json:{id:req.params.id,responseType:'JSON'}},
		
		function(error, response, body){
			if (!body || error) return res.sendStatus(400);
			
			var x = body.data.tankLevel.value;
			var a ={};
			a["percent"] = parseInt(x);
			res.json(a);
			
		});

});






/*
To get the Vehicle Battery Percentage 
*/



router.get('/vehicles/:id/battery', function(req, res) {
	request.post(
		gm_uri+'/getEnergyService',
			{json:{id:req.params.id,responseType:'JSON'}},
		
			function(error, response, body){
			
				if (!body || error) return res.sendStatus(400);
				
				var a = {};
				var x = body.data.batteryLevel.value;
				a["percent"] = parseInt(x);
				res.json(a);
			
		});

});






/*
To Post actions START or STOP to the GMServer 
*/



router.post('/vehicles/:id/engine', function(req, res) {
	var check;
	//console.log(req.body.action);
	if(req.body.action=="START"){
		
		check = "START_VEHICLE";
	}
	else{
		
		check = "STOP_VEHICLE";
	}
	request.post(
		gm_uri+'/actionEngineService',
		{json:{id:req.params.id,command:check,responseType:'JSON'}},
		
			function(error, response, body){
			
			if (!body || error) return res.sendStatus(400);
			var result = body.actionResult.status;
			var status;
			var a ={};

			if(result=="EXECUTED"){
				status = "success";
			}
			else{
				status = "error";
			}

			a["status"] = status;
			res.json(a);
			
		});
  
});



module.exports = router;