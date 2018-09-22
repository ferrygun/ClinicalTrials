const parseString = require('xml2js').parseString;
const fs = require('fs');
const ClinicalTrials = require('clinical-trials-gov');
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const defiant = require('defiant.js');

//Heremap API
const appid = "iQA4VQrg3Pts1thv0MbD"; 
const appcode = "MjsII_3Xaha17fKFj_kX4w"; 

let nctid = process.argv[2]; //nctid
const path = './XMLRes/';


const parseXML = (xml) => {
    let response;
    parseString(xml, {
        explicitArray: false,
        mergeAttrs: true,
        normalize: true,
    }, (err, result) => {
        if (!err) { 
            response = result;
        } else { throw err };
    });
    return response;
}


start();

function start() {
	getData(nctid, function(returnValue) {
		
		nctid = nctid.split('.');
		nctid = nctid[0];

		//For Linux
		/*
		nctid = nctid.split('/');
		nctid = nctid[7].split('.');
		nctid = nctid[0];
		*/


		fs.writeFile(path +  nctid + '.json', returnValue.trim(), 'utf8', function (err) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
			process.exit();
		}); 
	});
}

function getData(nctid, callback) {
	
		let jsonO = {
			"results" : {
			},
			"Spots" : {
			}
		}
		let jsonpost = [];
		let jsonspot = [];
		let json = [];

		json.push({
			eligibility: [],
			position: [],
			location: []
		});
			
		const main = async () => {
			//Read corresponding XML files from the result search
			const ReadF = async () => {
			 	return await readFile(nctid, 'utf-8');
			}

			let readFileContent = JSON.parse(JSON.stringify(parseXML(await ReadF())));
			readFileContent = readFileContent.clinical_study;

			json[0]["eligibility"] = readFileContent.eligibility;
			json[0]["location"] = readFileContent.location;

				
			let countryr =  await defiant.search(readFileContent.location, "//facility/address/country");
						
			for (let c = 0, len = countryr.length; c < len; c++) {
				let country = countryr[c];

				country = country.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')

				if(country == "Korea, Republic of") 
					country = "South Korea";
				if(country == "Macedonia, The Former Yugoslav Republic of")
					country = "Macedonia";
				if(country == "Former Serbia and Montenegro")
					country = "Serbia";
				if(country == "Iran, Islamic Republic of")
					country = "Iran";
				if(country == "Moldova, Republic of")
					country = "Moldova";
				if(country == "Korea, Democratic People's Republic of") 
					country = "South Korea";
				if(country == "Congo, The Democratic Republic of the") 
					country = "Congo";
				if(country == "Cte DIvoire")
					country = "Cote d'Ivoire";
				if(country == "Runion")
					country = "Reunion";
				if(country == "Lao People's Democratic Republic")
					country = "Lao";


				if(country != '') {
					let latlong = await ClinicalTrials.GetLatLong({searchtext: country, appid: appid, appcode: appcode});
					latlong = JSON.parse(latlong);

					//to check if country is exist/correct
					if(latlong.Response.View.length > 0) {
						const lat = latlong.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
						const lng = latlong.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
						//console.log('lat: ' + lat + ', lng: ' + lng);

						//Position JSON
						jsonpost.push({
							lat: lat,
							lng: lng
						});
					
						//Map Spots
						let found = jsonspot.findIndex(r => r.pos === lng + ';' + lat + ';0');
						if(found == -1) { //lat & long not found
							jsonspot.push({
								key: country,
								pos: lng + ';' + lat + ';0',
								tooltip: '1'
							});
						} else { //lat & long found
							let total = parseInt(jsonspot[found].tooltip);
							total = total + 1;
							jsonspot[found].tooltip = total.toString();
						}
					}
				}
			}

			json[0]["position"] = jsonpost;				

			jsonO["results"] = json;
			jsonO["Spots"] = jsonspot;

			callback(JSON.stringify(jsonO)); 
		}
		main().catch(console.error);

}

