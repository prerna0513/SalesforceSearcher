var conn = null;
var sfhost = null;

function generateTable(data) {
	debugger;
	let fileData = JSON.parse(data);
	var body = document.getElementsByTagName("body")[0];
	var tbl = document.createElement("table");
	tbl.setAttribute("class","table table-striped table-bordered");
	var tblBody = document.createElement("tbody");
    var row = tbl.insertRow(-1);
	var headerCell = document.createElement("TH");
	headerCell.innerHTML = 'Action';

	var headerCell1 = document.createElement("TH");
	headerCell1.innerHTML = 'Record Id';

	var headerCell2 = document.createElement("TH");
	headerCell2.innerHTML = 'Component Type';

	row.appendChild(headerCell);
	row.appendChild(headerCell1);
	row.appendChild(headerCell2);

	for (var i = 0; i < fileData.length; i++) {
		row = document.createElement("tr");
	    

	  for (var j = 0; j < 1; j++) {
		let aView = document.createElement("a");
        aView.href = sfhost + "/" + fileData[i].RecordId;
        aView.textContent = "View in Salesforce";
		aView.target = "_blank";
        //pop.appendChild(aView);

		var cell1 = document.createElement("td");
		var cellText1 = document.createTextNode(fileData[i].RecordId);
		var cell2 = document.createElement("td");
		var cellText2 = document.createTextNode(fileData[i].ComponentType);
		
		cell1.appendChild(cellText1);
		cell2.appendChild(cellText2);
		
		row.appendChild(aView);
		row.appendChild(cell1);
		row.appendChild(cell2);
		
	  }
	  
	  tblBody.appendChild(row);
	}
  
	tbl.appendChild(tblBody);
	body.appendChild(tbl);
	tbl.setAttribute("border", "2");
	console.log('In End');
  }


/*function setSelectedComponents(){
	console.log('In Selected CheckBox');
	let checkboxes = document.getElementsByClassName('checkmark');
	let message = "Id";
	let arr = [];
	for(let i=0 ; i < checkboxes.length; i++){
		if (checkboxes[i].checked) {
			document.body.append(checkboxes[i].value + ' ');

			let row = checkboxes[i].parentNode.parentNode;
			debugger;
			//message += row.childNodes[i].innerText;
			row.childNodes.forEach((item) => {console.log(item)});
			debugger;
			message += "\n";
			arr.push(message);
		}	
	}
    console.log('message:::',arr);
}*/

function exportCSV(data) {
	console.log('DATA IN CSV:::',data);
    let csvFile = Papa.unparse(data);
    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", 'output.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function performSearch() {
	console.log('IN EXECUTE QUERY');
	let searchWord = document.querySelector('#gsearch').value;
	console.log('searchWord', searchWord);

	let searchString = "FIND " + '{' + searchWord + '}'; 
	conn.search(searchString, function(err, result) {
		if (err) { return console.error(err); }
		if(result.searchRecords.length){
			const testData= new Map();
			let fileData = [];
			let data = result.searchRecords.map(currentItem => {
				var RecordId = currentItem.Id;
				var ComponentType = currentItem.attributes.type;
				let obj= Object.assign({},{RecordId:ComponentType});
				fileData.push({RecordId,ComponentType});
				return obj;
			});
			let exportData =JSON.stringify(fileData);
			generateTable(exportData);
			//exportCSV(exportData);
		}
	});
		
}


function getSession() {
	console.log('IN SESSSIOn');
	if(!document.querySelector('#gsearch').value.trim().length){
		return alert('Error!! Please provide an input');
	}

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	   	let tab = tabs[0];
	   	if(tab.url && (tab.url.includes('.lightning.force.com') || tab.url.includes('.salesforce.com'))){
            let instanceUrl = tab.url.split('.')[0] + '.my.salesforce.com';
			sfhost = instanceUrl;
            let port = chrome.extension.connect({ name: "Get Session" });
		    port.postMessage( instanceUrl.replace('https://','') );
			port.onMessage.addListener(function(sessionId) {
			    console.log("message recieved: " + sessionId);
			    conn = new jsforce.Connection({
	                serverUrl: instanceUrl,
	                instanceUrl: instanceUrl,
	                sessionId: sessionId,
	                version: '50.0',
	            });//jsforce

			    performSearch();
			});
        }else{
        	alert('Not a Salesforce Domain!');
        }
	});

}

document.querySelector("#search").addEventListener("click", getSession);

//document.querySelector("#selectedCheckboxes").addEventListener("click", setSelectedComponents);

var port = chrome.extension.connect({
	name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
	console.log("message recieved in popup" + msg);
});


