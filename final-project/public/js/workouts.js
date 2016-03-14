document.onreadystatechange = function() {
    if (document.readyState == "interactive") {
        //View data if any exists
        viewData();
    }
    
    if (document.readyState == "complete") {
        
        //Insert data
        document.getElementById("add-new").addEventListener("click", function(event){
           insertData(); 
        });
    }
}

/******************************************************** 
    GET REQUEST 
 ********************************************************/
function viewData() {
    var req = new XMLHttpRequest(),
        data = [];
    req.open("GET", "/view", true);
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400) {
            console.log(req.responseText);
            //If first visit (empty response), don't create table
            if(req.responseText == "[]"){
                return;
            }
            createTable(req.responseText);
        } else {
            console.log("Error in network request: " + request.statusText);
        }
    });
    req.send(null);
}

/******************************************************** 
    POST/INSERT REQUEST 
 ********************************************************/
function insertData() {
    var req = new XMLHttpRequest(),
        payload = {
            "name" : document.getElementById("name").value,
            "reps" : document.getElementById("reps").value,
            "weight" : document.getElementById("weight").value,
            "date" : document.getElementById("date").value,
            "lbs" : document.getElementById("lbs").value
        };
    
    req.open("POST", "/insert", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            console.log(response);
        } else {
            console.log("Error in network request: " + req.statusText);
        }    
    });
    req.send(JSON.stringify(payload));
}

/******************************************************** 
    DELETE REQUEST
    
    
    This AJAX request does not work. I've changed
    the server side code so that you can test it
    manually in the URL.
    
    
 ********************************************************/
function deleteRow(currentRow) {
    var req = new XMLHttpRequest(),
        payload = { "id" : 2 };
    req.open("POST", "/delete", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            var response = req.responseText;
            console.log(response);
            //delete client side once deleted from database
            //using code from assignment description
            var table = document.getElementById("workout-table"),
                rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i];
                if (row==currentRow.parentNode.parentNode) {
                    if (rowCount <= 1) {
                        alert("Cannot delete all the rows.");
                        break;
                    }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
}

/******************************************************** 
    UPDATE REQUEST
    
    This AJAX request does not work. I've changed
    the server side code so that you can test it
    manually in the URL.
    
 ********************************************************/
function editRow(currentRow) {
    var req = new XMLHttpRequest(),
        payload = { "id" : 2 };
    req.open("POST", "/update", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            var response = req.responseText;
            console.log(response);
            //code to open edit page with second form
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
}

/******************************************************** 
    DISPLAY TABLE 
 ********************************************************/

function createTable(data) {
    var json = JSON.parse(data),
        headers = ["Name","Reps","Weight","Date","Unit","Edit","Delete"],
        tableDiv = document.getElementById("table"),
        table = document.createElement("table"),
        caption = document.createElement("caption"),
        headRow = document.createElement("tr");
    
    //Append table and title to page
    table.setAttribute("id", "workout-table");
    tableDiv.appendChild(table);
    caption.textContent = "Completed Workouts";
    table.appendChild(caption);
    
    //Create and append header row
    headers.forEach(function(item){
        var headCell = document.createElement("th");
        headCell.textContent = item;
        headRow.appendChild(headCell);
    });
    table.appendChild(headRow);
    
    //Create rows from JSON data
    for (var i = 0; i < json.length; i++) {
        var obj = json[i],
            newRow = document.createElement("tr");
        
        //Create new cells from each key-value pair
        for (var key in obj) {
            //Skip id
            if (key != "id") {
                var newCell = document.createElement("td");
                //Deal with messy date output
                if (key == "date") {
                    var date = obj[key].slice(0,10);
                    newCell.textContent = date;
                //Deal with lbs input
                } else if (key == "lbs") {
                    if (obj[key] == 1) { newCell.textContent = "lbs"; }
                    else if (obj[key] == 0) { newCell.textContent = "kgs"; }
                    else { newCell.textContent = ""; }
                //Everything else
                } else {
                    newCell.textContent = obj[key];
                }
                newRow.appendChild(newCell);
            }
        }
        
        var editCell = document.createElement("td"),
            editBtn = document.createElement("input");
        editBtn.setAttribute("type", "submit");
        editBtn.setAttribute("value", "Edit");
        editBtn.setAttribute("onclick", "editRow(this)");
        editBtn.setAttribute("class", "btn btn-default");
        editCell.appendChild(editBtn);
        
        var deleteCell = document.createElement("td"),
            deleteBtn = document.createElement("input");
        deleteBtn.setAttribute("type", "submit");
        deleteBtn.setAttribute("value", "Delete");
        deleteBtn.setAttribute("onclick", "deleteRow(this)");
        deleteBtn.setAttribute("class", "btn btn-danger");
        deleteCell.appendChild(deleteBtn);
        
        newRow.appendChild(editCell);
        newRow.appendChild(deleteCell);        
        table.appendChild(newRow);
    }
    
    return table;
}