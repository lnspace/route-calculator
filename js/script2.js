var global = {
    data: [],
    A1: {},
    A2: {}
};

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
        for(var i = 0; i < global.data.length; i++){
            if (global.data[i].hasOwnProperty("AREA 1") && global.data[i].hasOwnProperty("AREA 2") && global.data[i].hasOwnProperty("M3")){
                var c1 = global.data[i]["AREA 1"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A1")),
                c2 = global.data[i]["AREA 2"].replace(/\s/g, '+') === getSelectedOption(document.getElementById("A2")),
                c3 = parseInt(global.data[i]["M3"]) === n;
                //console.log(c1,c2,c3);
                console.log(global.data[i]);
                if(c1 && c2 && c3){
                    document.querySelector("#standard").innerHTML = global.data[i]["standard"];
                    document.querySelector("#backload").innerHTML = global.data[i]["backload"];
                    valid = true;
                    break;
                }
            }
        }
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
}
function read_csvs(url,call){
    var data;
    Papa.parse(url, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            console.log(results);
            global.data = global.data.concat(results.data);
            update_A1();
            update_A2();
            setTimeout(function(){
                document.querySelector('#load').classList.replace("indeterminate","determinate");
            },1000);
        }
    });
    return data;
}


function read_names(url,call){
    var data;
    Papa.parse(url, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            results.data.forEach(function(n){
                var nurl = "https://raw.githubusercontent.com/lnspace/route-tracker/master/"+n.Name+".csv";
                read_csvs(nurl);
            });
        }
    });
    return data;
}

window.onload = function(){
    var name = "input.csv";
    var url = "https://raw.githubusercontent.com/lnspace/route-tracker/master/file_name.csv";
    read_names(url);
    document.getElementById("M3").onkeyup = calculate;

};
