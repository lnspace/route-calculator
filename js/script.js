var global = {
    data: [],
    A1: {},
    A2: {}
};


function santizeKeys(obj){
    for(var key in obj){
        var tmp = obj[key];
        delete obj[key];
        obj[key.replace(/[^a-z0-9+]+/gi, '')] = tmp;
    }
    return obj;
}

function getSelectedOption(sel) {
        var opt;
        for ( var i = 0, len = sel.options.length; i < len; i++ ) {
            opt = sel.options[i];
            if ( opt.selected === true ) {
                break;
            }
        }
        return opt.value;
    }

function calculate(){
    console.log("36: ",global.data[36]);
    var n = parseInt(this.value);
    if(Number.isInteger(n)){
        var valid = false;
        global.data.forEach(function(i){
            if (i.hasOwnProperty("AREA 1") && i.hasOwnProperty("AREA 2") && i.hasOwnProperty("M3")){
                var c1 = i["AREA 1"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A1")),
                c2 = i["AREA 2"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A2")),
                c3 = parseInt(i["M3"]) === n;
                //console.log(c1,c2,c3);
                console.log(i["AREA 1"],i["AREA 2"]);
                if(c1 && c2 && c3){
                    document.querySelector("#standard").innerHTML = i["standard"];
                    document.querySelector("#backload").innerHTML = i["backload"];
                    valid = true;
                }
            }
            else{
                console.log(i,i["AREA 1"],i["AREA 2"]);

            }
        });
        if(!valid){
            document.querySelector("#standard").innerHTML = "NA";
            document.querySelector("#backload").innerHTML = "NA";
        }
    }
}

function calculate_2(){
    console.log("36: ",global.data[36]);
    var n = parseInt(this.value);
    if(Number.isInteger(n)){
        var valid = false;
        global.data.forEach(function(i){
            if (i.hasOwnProperty("AREA1") && i.hasOwnProperty("AREA2") && i.hasOwnProperty("M3")){
                var c1 = i["AREA1"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A1")),
                c2 = i["AREA2"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A2")),
                c3 = parseInt(i["M3"]) === n;
                //console.log(c1,c2,c3);
                console.log(i["AREA1"],i["AREA2"]);
                if(c1 && c2 && c3){
                    document.querySelector("#standard").innerHTML = i["standard"];
                    document.querySelector("#backload").innerHTML = i["backload"];
                    valid = true;
                }
            }
            else{
                console.log(i,i["AREA1"],i["AREA2"]);

            }
        });
        if(!valid){
            document.querySelector("#standard").innerHTML = "NA";
            document.querySelector("#backload").innerHTML = "NA";
        }
    }
}

function update_A1(){
    var set = {};
    global.data.forEach(function(i){
        var opt = i["AREA 1"] ? i["AREA 1"].replace(/\s/g, '+') : false;
        if(opt && !set.hasOwnProperty(opt) && !global.A1.hasOwnProperty(opt)){
            set[opt] = opt;
            global.A1[opt] = opt;
            document.querySelector("select").innerHTML += "<option value='"+opt+"'>"+opt+"</option>";

        }
    });
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
}
function update_A2(){
    var set = {};
    global.data.forEach(function(i){
        var opt = i["AREA 2"] ? i["AREA 2"].replace(/\s/g, '+') : false;
        if(opt && !set.hasOwnProperty(opt) && !global.A2.hasOwnProperty(opt)){
            set[opt] = opt;
            global.A2[opt] = opt;
            document.querySelectorAll("select")[1].innerHTML += "<option value='"+opt+"'>"+opt+"</option>";

        }
    });
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    global.data.forEach(function(j){ santizeKeys(j); });
}

function recurs(url,i){
    Papa.parse(url, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            recurs("https://raw.githubusercontent.com/lnspace/jason/master/csv/input_"+(i+1)+".csv",i+1);
            console.log(results);
            // console.log(data);
            global.data = global.data.concat(results.data);
            update_A1();
            update_A2();
            setTimeout(function(){
                document.querySelector('#load').classList.replace("indeterminate","determinate");
            },1000);

        },
        error: function(err){
            console.log("url: ",url," does not exist");
        }
    });
}

window.onload = function(){

    recurs("https://raw.githubusercontent.com/lnspace/jason/master/csv/input_1.csv",1);
    document.getElementById("M3").onkeyup = calculate_2;

};
