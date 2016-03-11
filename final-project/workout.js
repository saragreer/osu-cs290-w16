document.getElementById("workout-submit").addEventListener("click", function(event){
    //get submitted values from form
    var name = document.getElementById("name").value,
        reps = document.getElementById("reps").value,
        weight = document.getElementById("weight").value,
        date = document.getElementById("date").value,
        lbs = document.getElementsByName("measurement").value,
        newCells = [];
        newRow = document.createElement("tr");
    newCells.push(name);
    newCells.push(reps);
    newCells.push(weight);
    newCells.push(date);
    newCells.push(lbs);
    newCells.forEach(function(cell){
       newRow.textContent = cell; 
    });
    document.getElementById("workout-table").appendChild(newRow);
    //print values to screen
});

/**
function buildTable(){
    var widthArr = [],
        heightArr = [],
        table = document.createElement("table"),
        headRow = document.createElement("tr");
    
    //Break up user input into arrays
    for (var i = 1; i <= width; i++) { widthArr.push(i); }
    //Subtract 1 from height to keep header row inclusive
    for (var i = 1; i < height; i++) { heightArr.push(i); } 
    
    //create header row and style cells
    widthArr.forEach(function(num) {
        var headCell = document.createElement("th");
        headCell.textContent = "Header " + num;
        headRow.appendChild(headCell);
        headCell.style.border = "1px solid black";
        headCell.style.padding = "3px 10px";
    });
    table.appendChild(headRow);
    
    //create other rows, fill with cells' positions, style cells
    heightArr.forEach(function(tableRow) {
        var newRow = document.createElement("tr");
        widthArr.forEach(function(tableCol) {
            var newCell = document.createElement("td");
            newCell.textContent = tableCol + ", " + tableRow;
            newCell.setAttribute("id", tableCol + "-" + tableRow);
            newRow.appendChild(newCell);
            newCell.style.border = borderRegular;
            newCell.style.padding = "3px 10px";
        });
        table.appendChild(newRow);
    });
    
    //style table
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "20px";
    return table;
}
  });
**/