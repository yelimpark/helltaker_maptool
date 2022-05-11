var curMapCode = "E";

function setCurMapCode(mapCode, caller) {
    let buttonlist = document.getElementsByClassName("bottom_menu")[0].children;
    for (i = 0; i < buttonlist.length; i++) {
        buttonlist[i].setAttribute("class", "deactive");
    }

    if (curMapCode == mapCode) {
        curMapCode = "E";
    }
    else {
        curMapCode = mapCode;
        caller.setAttribute("class", "active");
    }
}

function styleGrid() {
    let image = document.getElementById('bg_image');
    let grid = document.getElementById('grid');

    grid.style.width = 1920 + 'px';

    let LeftMarginWidth = parseInt(document.getElementById('left_margin_input').value);
    let TopMarginHeight = parseInt(document.getElementById('top_margin_input').value);
    let tile_size = document.getElementById('tile_size_input').value;

    var rows = parseInt(image.height / tile_size);
    var cols = parseInt(image.width / tile_size);

    // top margin
    const topMargin = grid.insertRow();
    topMargin.setAttribute('colspan', String(cols));
    topMargin.setAttribute('class', 'top_margin');
    topMargin.style.height = TopMarginHeight - 1 + 'px';

    // left margin 들어가는 부분
    const firstRow = grid.insertRow();

    let leftMargin = document.createElement('td');
    leftMargin.style.width = LeftMarginWidth - 1 + 'px';
    leftMargin.setAttribute('class', 'left_margin');
    leftMargin.setAttribute('rowspan', String(rows));

    firstRow.appendChild(leftMargin);

    for (i = 0; i < cols; i++) {
        let newCell = document.createElement('td');
        newCell.setAttribute('class', 'E');
        newCell.setAttribute('onclick', 'SetCellMapCode(this)');
        newCell.style.height = tile_size - 1 + 'px';
        newCell.style.width = tile_size - 1 + 'px';
        firstRow.appendChild(newCell);
    }

    // 그 외
    for (j = 0; j < rows - 1; j++) {
        const newRow = grid.insertRow();

        for (i = 0; i < cols; i++) {
            let newCell = document.createElement('td');
            newCell.setAttribute('class', 'E');
            newCell.setAttribute('onclick', 'SetCellMapCode(this)');
            newCell.style.height = tile_size - 1 + 'px';
            newCell.style.width = tile_size - 1 + 'px';
            newRow.appendChild(newCell);
        }
    }

}

function SetCellMapCode(obj) {
    if (obj.classList[0] != curMapCode) {
        obj.setAttribute('class', curMapCode);
    }
    else {
        obj.setAttribute('class', "E");
    }
} 

function save() {
    var csvData = "";

    let grid = document.getElementById('grid');
    var trList = grid.children[0].children;
    for (i = 1; i < trList.length; i++) {
        var tdList = trList[i].children;
        for (j = 0; j < tdList.length; j++) {
            if (tdList[j].classList[0] != "left_margin")
                csvData += tdList[j].classList[0] + ",";
        }

        csvData += "\r\n";
    }

    var blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    objURL = window.URL.createObjectURL(blob);

    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = "map";
    a.href = objURL;
    a.click();
}

function setThumbnail(event) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        img.setAttribute("id", "bg_image");
        document.querySelector("div#image_container").appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

window.onload = function () {
    dragElement(document.getElementById("canvas"));
}