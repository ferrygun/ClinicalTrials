'use strict'

const ClinicalTrials = require('clinical-trials-gov');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs');
const zlib = require('zlib');
const defiant = require('defiant.js');
const heartbeats = require('heartbeats');

//Heremap API
const appid = "iQA4VQrg3Pts1thv0MbD"; 
const appcode = "MjsII_3Xaha17fKFj_kX4w"; 

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
//app.use(bodyParser.json())

const  compression = require('compression');
app.use(compression());

app.get('/', (req, res) => {

	let cond = req.query.cond;
	let cntry = req.query.cntry;
	let state = req.query.state;
	let city = req.query.city;
	let gndr = req.query.gndr;
	let recrs = req.query.recrs;
	let age = req.query.age;
	let dist = req.query.dist;
	let nctid = req.query.nctid;

	let q = req.query.q;
	
	if (q == '0') { //To list down nctid: http://localhost/nodejs?q=1&cond=ALK-positive&cntry=US&state=&city=&recrs=&gndr=&age=&dist=10676

		ClinicalTrials.search({cond: cond, cntry, state, city, gndr, recrs, age, dist}).then(trials => {
			if (typeof trials != 'undefined') {

				let data = JSON.parse(JSON.stringify(trials));
				
				let jsonO = {
					"results" : {
					},
					"Spots" : {
					}
				}
				let jsonpost = [];
				let jsonspot = [];
				let json = [];

				let order = '';
				let score = '';
				let nct_id = '';
				let url = '';
				let title = '';
				let status = '';
				let condition_summary = '';
				let intervention_summary = '';
				let last_changed = '';
				let last_update_submitted = '';
				let last_update_posted = '';

				
				
				const main = async () => {
					let i = data.length;

					console.log('len:' + i)
					let k = 0;
					while (i--) {

						if(typeof data[k].order === 'undefined') 
							order = " ";
						else
							order = data[k].order;

						if(typeof data[k].score === 'undefined') 
							score = " ";
						else
							score = data[k].score;

						if(typeof data[k].nct_id === 'undefined') 
							nct_id = " ";
						else
							nct_id = data[k].nct_id;

						if(typeof data[k].url === 'undefined') 
							url = " ";
						else
							url = data[k].url;

						if(typeof data[k].title === 'undefined') 
							title = " ";
						else
							title = data[k].title;

						if(typeof data[k].status === 'undefined') 
							status = " ";
						else
							status = data[k].status;

						if(typeof data[k].condition_summary === 'undefined') 
							condition_summary = " ";
						else
							condition_summary = data[k].condition_summary;

						if(typeof data[k].intervention_summary === 'undefined') 
							intervention_summary =" ";
						else
							intervention_summary = data[k].intervention_summary;

						if(typeof data[k].last_changed === 'undefined') 
							last_changed = " ";
						else
							last_changed = data[k].last_changed;

						if(typeof data[k].last_update_submitted === 'undefined') 
							last_update_submitted = " ";
						else
							last_update_submitted = data[k].last_update_submitted;

						if(typeof data[k].last_update_posted  === 'undefined') 
							last_update_posted = " ";
						else
							last_update_posted = data[k].last_update_posted;

						json.push({
							order: order,
							score: score,
							nct_id: nct_id,
							url: url,
							title: title,
							status: status,
							condition_summary: condition_summary,
							intervention_summary: intervention_summary,
							last_changed: last_changed,
							last_update_submitted: last_update_submitted,
							last_update_posted: last_update_posted
						});

						//console.log(k + ':' + nct_id);
						jsonO["results"] = json;
						jsonO["Spots"] = '';
						

						if(k == data.length-1) 
							res.end(JSON.stringify(jsonO));
						

						k++;
					}
				};

				main().catch(console.error);

			} else {
				//no records
				res.end(JSON.stringify({}));

			}
		});

	} 
	else if (q == '1') { //To be consumed by UI5: http://localhost/nodejs?q=1&cond=ALK-positive&cntry=US&state=&city=&recrs=&gndr=&age=&dist=10676
		//https://clinicaltrials.gov/ct2/results?displayxml=true&cond=Eye Strain&cntry=US&state=&city=&gndr=&recrs=&age=&dist=10676&count=10000

		ClinicalTrials.search({cond: cond, cntry, state, city, gndr, recrs, age, dist}).then(trials => {
			if (typeof trials != 'undefined') {

				let data = JSON.parse(JSON.stringify(trials));
				
				let jsonO = {
					"results" : {
					},
					"Spots" : {
					}
				}
				let jsonpost = [];
				let jsonspot = [];
				let json = [];

				let order = '';
				let score = '';
				let nct_id = '';
				let url = '';
				let title = '';
				let status = '';
				let condition_summary = '';
				let intervention_summary = '';
				let last_changed = '';
				let last_update_submitted = '';
				let last_update_posted = '';

				
				let heart = heartbeats.createHeart(1000);

				heart.createEvent(1, function(count, last){
		    		res.write(" ");
				});

				const main = async () => {
					let i = data.length;

					console.log('len:' + i)
					let k = 0;
					while (i--) {

						if(typeof data[k].order === 'undefined') 
							order = " ";
						else
							order = data[k].order;

						if(typeof data[k].score === 'undefined') 
							score = " ";
						else
							score = data[k].score;

						if(typeof data[k].nct_id === 'undefined') 
							nct_id = " ";
						else
							nct_id = data[k].nct_id;

						if(typeof data[k].url === 'undefined') 
							url = " ";
						else
							url = data[k].url;

						if(typeof data[k].title === 'undefined') 
							title = " ";
						else
							title = data[k].title;

						if(typeof data[k].status === 'undefined') 
							status = " ";
						else
							status = data[k].status;

						if(typeof data[k].condition_summary === 'undefined') 
							condition_summary = " ";
						else
							condition_summary = data[k].condition_summary;

						if(typeof data[k].intervention_summary === 'undefined') 
							intervention_summary =" ";
						else
							intervention_summary = data[k].intervention_summary;

						if(typeof data[k].last_changed === 'undefined') 
							last_changed = " ";
						else
							last_changed = data[k].last_changed;

						if(typeof data[k].last_update_submitted === 'undefined') 
							last_update_submitted = " ";
						else
							last_update_submitted = data[k].last_update_submitted;

						if(typeof data[k].last_update_posted  === 'undefined') 
							last_update_posted = " ";
						else
							last_update_posted = data[k].last_update_posted;

						json.push({
							order: order,
							score: score,
							nct_id: nct_id,
							url: url,
							title: title,
							status: status,
							condition_summary: condition_summary,
							intervention_summary: intervention_summary,
							last_changed: last_changed,
							last_update_submitted: last_update_submitted,
							last_update_posted: last_update_posted,
							eligibility: [],
							position: [],
							location: []
						});

						//console.log(k + ':' + nct_id);
						
						try {
						  	
						  	const returnValue = require('/home/ubuntu/CT/dummy/XMLRes/' + nct_id + '.json');
						  	//const returnValue = require('./XMLRes/' + nct_id + '.json');
						  	//const returnValue = require('./' + 'NCT00000611' + '.json');
						  	
						  	json[k]["eligibility"] = returnValue.results[0].eligibility;
							json[k]["position"] =  returnValue.results[0].position;
							jsonpost = [];
							json[k]["location"] = returnValue.results[0].location;

							
							for (let c = 0, len = returnValue.Spots.length; c < len; c++) {
																
								//Map Spots
								let found = jsonspot.findIndex(r => r.pos === returnValue.Spots[c].pos);
								if(found == -1) { //pos not found
									jsonspot.push({
										key: returnValue.Spots[c].key,
										pos: returnValue.Spots[c].pos,
										tooltip: '1'
									});
								} else { //pos found
									let total = parseInt(jsonspot[found].tooltip);
									total = total + 1;
									jsonspot[found].tooltip = total.toString();
								}
								
							}

							jsonO["results"] = json;
							jsonO["Spots"] = jsonspot;
						}
						catch (e) {
							console.log(e);
						}
						

						if(k == data.length-1) {
							heart.kill();
							res.set('Content-Type', 'application/json');
							res.end(JSON.stringify(jsonO));
						}
						

						k++;
					}
				};

				main().catch(console.error);

			} else {
				//no records
				res.end(JSON.stringify({}));

			}
		});

	} else if (q == '2') { //To view details from UI5: http://localhost/nodejs?q=2&nctid=NCT00001372
		ClinicalTrials.searchD({nctid: nctid}).then(trials => {
			//console.log(trials);
			res.end(JSON.stringify(trials));
		});

	}
	
})



function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function Start() {
	// Spin up the server
	app.listen(app.get('port'), function() {
		console.log('Clinical Trials running on port', app.get('port'))
	});
}
Start();
