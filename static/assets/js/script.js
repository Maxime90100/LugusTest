let display = [];
let sizeList = [];
var selectedColor = null;
var selectedSize = null;

var getJSON = function(url, callback) {
    var xmlhttprequest = new XMLHttpRequest();
    xmlhttprequest.open('GET', url, true);
    xmlhttprequest.responseType = 'json';
    xmlhttprequest.onload = function() {
        var status = xmlhttprequest.status;
        if (status == 200) {
            callback(null, xmlhttprequest.response);
        } else {
            callback(status, xmlhttprequest.response);
        }
    };
    xmlhttprequest.send();
};

function start(){
    getJSON('https://lugus-hiring.frb.io/product', function (err, data){
        if (err != null) {
            console.error(err);
        } else {
            display = new Array();
            for(i=0; i<data.product.variants.length; i++){
                display.push(data.product.variants[i])
            }
            document.getElementById('title').innerHTML = data.product.title;
            document.getElementById('description').innerHTML = data.product.description;
        }
    });
    changeColor('green');
}

function changeImage(color){
    for(i=0; i<display.length; i++) {
        if(display[i].color === color)
            document.getElementById('image').innerHTML = "<img src='"+display[i].image+"' alt='"+color+" shoes'>";
    }
    document.getElementById('image').innerHTML = "<img src=\"static/images_asset/shoes-"+selectedColor+".png\" alt="+selectedColor+"-shoes\">";
}

function changeColor(color) {
    selectedColor = color;
    console.log("selectedColor: "+selectedColor);
    changeImage(selectedColor);

    sizeList = new Array();
    for(i=0; i<display.length; i++){
        if(display[i].color === selectedColor & display[i].quantity > 0){
            sizeList.push(display[i].size);
        }
    }
    var size = '';
    for(i=42; i<=46; i++){
        if(sizeList.includes(i.toString())){
            size += "<input id='size' class='available size"+i+"' type='radio' name='size' onChange='changeSize(this.value)' value='"+i+"'>"
        }
        else{
            size += "<input id='size' class='unavailable size"+i+"' type='radio' name='size' onChange='changeSize(this.value)' value='"+i+"'>"
        }
    }
    document.getElementById('selectSize').innerHTML = size;
    selectedSize = null;
    document.getElementById('check').innerHTML = '';
}

function changeSize(size){
    selectedSize = size;
    console.log("selectedSize: "+selectedSize);
    for(i=0; i<display.length; i++){
        if(display[i].color === selectedColor & display[i].size === selectedSize){
            document.getElementById('price').innerHTML = display[i].price+"€";
        }
    }
    if(sizeList.includes(selectedSize))
        document.getElementById('button').innerHTML = "<button type='button' class='btn btn-success mt-4' onclick='submit(selectedColor,selectedSize)'>Add to cart</button>";
    else
        document.getElementById('button').innerHTML = "<button type='button' class='btn btn-secondary mt-4' disabled>Out of Stock</button>";
    document.getElementById('check').innerHTML = '';
}

function submit(color, size) {
    if (selectedSize === null) {
        alert("Please select size before add to cart");
    } else {
        var id;
        for (i = 0; i < display.length; i++) {
            if (display[i].color === color & display[i].size === size)
                id = display[i].id;
        }
        console.log("id: " + id);

        var xmlhttprequest = new XMLHttpRequest();
        xmlhttprequest.open("POST", "https://lugus-hiring.frb.io/cart/add", true);
        xmlhttprequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttprequest.send(JSON.stringify({"variant_id" : id, quantity : 1 }));

        document.getElementById('button').innerHTML = "<button type='button' class='btn btn-success mt-4' disabled>Added to cart</button>";
        document.getElementById('check').innerHTML = "<i class='bi bi-check-circle text-success'></i>"

    }
}