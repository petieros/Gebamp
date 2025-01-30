


//https:stackoverflow.com/questions/2799283/use-a-json-array-with-objects-with-javascript


document.addEventListener('DOMContentLoaded', loadDropdownOptions1);
var menü_json = [ {
    "text": "Ajax technika",
    "ikon": "images/bizi-32.png",   //ikonokat találsz a /images/ mappában ...  
    "url": "a.html",
    "tip": 0                 // 0: ajax--> "id="main1" TAG-be; 1: teljes oldal <a>; 2: <a target="blank"  
  }, {
    "text": "JSON div táblázat",
    "ikon": "images/school-32.png",
    "url": "jsontabla.html",
    "tip": 0
  }, {
    "text": "SQL tokenizer",
    "ikon": "images/diak-32.png",
    "url": "c.html",
    "tip": 0
  }, {
    "text": "JSON RestFul",
    "ikon": "images/lakat-32.png",
    "url": "datatables.html",
    "tip": 0
  }, {
    "text": "Profi datagrid megoldások",
    "ikon": "images/mod-32.png",
    "url": "https://www.datatables.net/",
    "tip": 2
  }, {
    "text": "Beállítások",
    "ikon": "images/xls-32.png",
    "url": "f.html",
    "tip": 0
  }, {
    "text": "Csány Technikum weboldala",
    "ikon": "images/zaras-32.png",
    "url": "https://www.csany-zeg.hu/",
    "tip": 2  
  }];
  
  
  /* menü_json ból menüpontokat generál id="menu1_ul" ba
  --------------------------------------------------------------*/
  
  
  /* ------- nem kell sql injection ! tessék szépen "kieszképelni" a user inputot! */
  function strE(s) { return s.replaceAll("'","").replaceAll("\"","").replaceAll("\t","").replaceAll("\\","").replaceAll("`","");}
  
  
  /* length kar. hosszú reandom stringet generál (pl: jelszó, vagy auto ID generátor)
  -------------------------------------------------*/
  function makeid(length) {
  let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  
  /* server: url címről <TAG> "hova" id-be kerül a html / json adat
  -----------------------------------------------------------------*/
  function ajax_get( urlsor, hova, tipus, aszinkron ) {
    $.ajax({url: urlsor, type:"get", async:aszinkron, cache:false, dataType:tipus===0?'html':'json',
        beforeSend:function(xhr)   { $('#loader1').css("display","block");  }, 
        success:   function(data)  { $(hova).html(data); },
        error:     function(jqXHR, textStatus, errorThrown) {mySend({text:jqXHR.responseText, tip:"danger", mp:5});},
        complete:  function()      { $('#loader1').css("display","none"); }   
    });
  return true;
  };
  
  /* server: url címről "return s"-be kerül a html / json adat: Rest API
  /*-------------------------------------------------------------------*/
  function ajax_post( urlsor, tipus ) {
    var s = "";
    $.ajax({url: urlsor, type:"post", async:false, cache:false, dataType:tipus===0?'html':'json',
        beforeSend:function(xhr)   { $('#loader1').css("display","block");  }, 
        success:   function(data)  { s = data; },
        error:     function(jqXHR, textStatus, errorThrown) {mySend({text:jqXHR.responseText, tip:"danger", mp:5});},
        complete:  function()      { $('#loader1').css("display","none"); } 
    });
    return s;
  };  
  
  /* üzenet ablakot generál, s jelenít meg. alkalmazása: 
   mySend( {text: "Pite!",  tip: Bootstap --> "info" "success", "warning", "error"} );   
  -------------------------------------------------------------------------------------*/
  function mySend( ops ) {
    
    var defOps = {text:"", tip:`${ops}`, mp:5 };   /* tip: info, success, danger, warning; mp: 5 másodperc (0:off) */
    ops = $.extend( {}, defOps, ops );              // tömb összefésülése  
    var id = "toast1";
    var idx = "#"+id;                               // jquery
    var s =`<div id="${id}" class="toast bg-${ops.tip} text-black hide" style="position:fixed; right:10px; bottom:10px; z-index:99999">
                <div class="toast-header">
                <h3 class="me-auto"><i class="bi bi-chat-square-text"></i> ${ops.tip} ...</h3>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
              </div>
                <div class="toast-body" style="font-size: 12pt; font-weight:bold;">${ops.text}</div>
            </div>`;
  
    $(idx).remove();       
    $("body").append(s); 
  
    if (ops.mp == 0) { $(idx).toast({ autohide: false }); } 
    $(idx).toast("show");
  };
  
  /* kérdés ablakot generál, s jelenít meg. Alkalmazása: 
   myQuestion({text: `Pite ...? `});
   $("#myQuestion").on("click",".btn-success", function() {  mySend( {text: "Pite!",  tip:"warning"} );   });
  -----------------------------------------------------------------------------------------------------------*/
  function myQuestion( ops ) {
    var id = "myQuestion";
    var idx = "#"+id;                               // jquery
    var s =`<div class="modal" id="${id}" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header bg-secondary text-white"><h3 class="modal-title">Megerősítés</h3></div>
                <div class="modal-body">${ops.text}</div>
                <div class="modal-footer">
                    <div class="button ok" data-bs-dismiss="modal">OK</div>
                    <div class="button cancel" data-bs-dismiss="modal">mégse</div>
                </div>
                </div>
            </div>
            </div>`;
           
    $(idx).off('click');       // unbind, különben N.szer futna le az N. hívásra !!        
    $(idx).remove();      
    $("body").append(s); 
    $(idx).modal('show');   
  };

//            ADMINOS CUCCOK

  function felhasznaloclick(adat){
    adminfelhasznalo = adat.split(',')[0];
    adminjelszo = adat.split(',')[1];
      xhrAdatSok = new XMLHttpRequest();
      xhrAdatSok.open("get", `/bejel?user=${adminfelhasznalo}&jelsz=${adminjelszo}`, true);
      xhrAdatSok.send();
      xhrAdatSok.onreadystatechange = function() {
            if (xhrAdatSok.readyState == 4 && xhrAdatSok.status == 200) {
             if(xhrAdatSok.responseText == "Nem"){
              mySend({text:"Sikertelen bejelentkezés!", tip:"danger", mp:5})
             }
              else  {
                tanulodid = null;
                login1_user.innerHTML = JSON.parse(xhrAdatSok.responseText)[0].NEV
                mySend({text:"Sikeres bejelentkezés!", tip:"success", mp:5})
                $('#login1_modal').modal("hide");
                $("#userkep").css("display", "none");               
                $("#login1_modal_button").css("display", "none");
                navbarspan.innerHTML = '<div id="user1_logout_button2" class="button logout" onclick="kijel()">Logout</div>'
                $("#nembelepettkep").css("display", "none");
                $("#belepettkep").css("display", "block");
                $("#adminbigdiv").css("display", "block");
                $("#userbigdiv").css("display", "none");
                user1_login_field.value = "";
                user1_passwd_field.value = "";
                jo = setInterval(() => {       
                  if (!($("#myQuestion").is(":visible"))) {
                    kijel();
                  }             
                  jo2 = setInterval(() => {
                      if(valtozo == 0){location.reload()}
                      valtozo = 0;
                    }, 300000);               
                  }, 7200000);
              }
            }
          
      }
      
    }

    function gep_szerkesztes(){
      myQuestion({text: `Biztosan szerkeszteni akarod a gépet? `});
      $("#myQuestion").on("click",".ok", function() {
        xhrAdatSok = new XMLHttpRequest();
        xhrAdatSok.open("get", `/gepszerkesztes?gep=${gepnev}`, true);
        xhrAdatSok.send();
        xhrAdatSok.onreadystatechange = function() {
            if (xhrAdatSok.readyState == 4 && xhrAdatSok.status == 200) {
              mySend({text:"Gép szerkesztve!", tip:"success", mp:5});
            }
        }
      })}


    
    var valtozo = 0;
    function kijel(){
      logout();
      vissza();
    }

function valaszto(adat){
  if(adat == "admin"){
    $("#bejelablak").css("display", "block");
    $("#valasztott").css("display", "none");
    $("#userbejel").css("display", "none");
  }
  else{
    $("#bejelablak").css("display", "none");
    $("#valasztott").css("display", "none");
    $("#userbejel").css("display", "block");
    document.getElementById("user1_login_fieldOM").focus();
  }

}
function vissza(){
  $("#bejelablak").css("display", "none");
  $("#valasztott").css("display", "block");
  $("#userbejel").css("display", "none");
  user1_login_field.value = "";
  user1_passwd_field.value = "";
  user1_login_fieldOM.value = "";

}
var tanulodid;
var jo2;



//          USERES CUCCOK

function userbejelclick(adat){
  tanulodid = null
  xhrAdatSok = new XMLHttpRequest();
  xhrAdatSok.open("get", `/rfid?rfid=${adat}`, true);
  xhrAdatSok.send();
  xhrAdatSok.onreadystatechange = function() {
      if (xhrAdatSok.readyState == 4 && xhrAdatSok.status == 200) {
         if(xhrAdatSok.responseText == "Nem"){
          mySend({text:"Sikertelen bejelentkezés!", tip:"danger", mp:5})
         }
          else  {
            mySend({text:"Sikeres bejelentkezés!", tip:"success", mp:5})
            user1_login_fieldOM.value = "";
            $('#login1_modal').modal("hide");
                login1_user.innerHTML = JSON.parse(xhrAdatSok.responseText)[0].a
                $("#login1_modal_button").css("display", "none");
                navbarspan.innerHTML = '<div id="user1_logout_button2" class="button logout" onclick = kijel()>Logout</div>'
                $("#nembelepettkep").css("display", "none");
                $("#userkep").css("display", "block");
                $("#adminbigdiv").css("display", "none");
                $("#userbigdiv").css("display", "block");
                tanulodid = JSON.parse(xhrAdatSok.responseText)[0].b;
                sendTanuloId();
              jo = setInterval(() => {           
                if (!($("#myQuestion").is(":visible"))) {
                kijel();
                }             
                jo2 = setInterval(() => {
                  if(valtozo == 0){
                    sendTanuloId2();
                    location.reload()
                  }
                  valtozo = 0;
                }, 500000);               
              }, 1000000);  
          }}}
}



var jo;
function logout() 
{
  myQuestion({text: `Kijelentkezés megerősítése...? `});
    $("#myQuestion").on("click",".ok", function() {
        //var session_response = ajax_post("logout", 1) ;  
        mySend({text:"Sikeres kijelentkezés!", tip:"success", mp:3});
        if (($("#userbigdiv").is(":visible"))) {
          sendTanuloId2();
        }
        $("#user1_logout_button2").css("display", "none");
        $("#login1_user").html("Login: Még senki...." );
        $('#login1_user').prop('title', "[...]");
        $('#login1_modal').modal('hide');
        $('#login1_modal_button').css('display', 'block').click(function() { login_show();  });
        $("#nembelepettkep").css("display", "block");
        $("#belepettkep").css("display", "none");
        $("#userkep").css("display", "none");
        $("#adminbigdiv").css("display", "none");
        $("#admin_div").css("display", "none");
        $("#admin_div2").css("display", "none");
        $("#admin_div3").css("display", "none");
        $("#userbigdiv").css("display", "none");
        $("#user_div").css("display", "none");
        $("#user_div2").css("display", "none");
        $("#user_div3").css("display", "none");
        $("#user_div4").css("display", "none");
        $("#admin_div4").css("display", "none");
        $("#admin_div5").css("display", "none");
        $("#admin_div7").css("display", "none");
        userkijel();
        valtozo= 0;
        tanulodid = null;
        clearInterval(jo);
        clearInterval(jo2);


    }); 
    $("#myQuestion").on("click",".cancel", function() {
      valtozo= 1;
      
  }); 
}

function userkijel(){
  if(tanulodid != null || tanulodid != undefined || localStorage.getItem('tanulodid') != null){ 
    var xhrAdatSok = new XMLHttpRequest();
    xhrAdatSok.open("get", `/userlogout?tanuloid=${tanulodid}`, true);
    xhrAdatSok.send();

    }
  }



/* function gep_felvetel2(){
  myQuestion({text: `Biztosan fel akarod venni a gépet? `});
  $("#myQuestion").on("click",".ok", function() {
    xhrAdatSok = new XMLHttpRequest();
    xhrAdatSok.open("get", `/gepfelvetel?gep=${gepnev}`, true);
    xhrAdatSok.send();
    xhrAdatSok.onreadystatechange = function() {
        if (xhrAdatSok.readyState == 4 && xhrAdatSok.status == 200) {
          mySend({text:"Gép felvéve!", tip:"success", mp:5});
        }
    }
  })} */


function gep_felvetel() {
    const nev = document.getElementById('admin_field1').value;
    const leltariAzonosito = document.getElementById('admin_field2').value;
    const vonalkod = document.getElementById('admin_field3').value;
    const gep_id = admin_dropdown.value;
    if (!nev || !leltariAzonosito || !vonalkod || !gep_id) {
      alert('Minden mezőt ki kell tölteni!');
      return;
    }

    const data = `${nev},${leltariAzonosito},${vonalkod},${gep_id}`;
    const xhr = new XMLHttpRequest();
    console.log(data);
    xhr.open('get', `/gep_felvetel3?adat=${data}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && xhr.responseText != "Baj" && xhr.responseText != "Már létezik ilyen gép") {
          mySend({text:"Gép sikeresen felvéve!", tip:"success", mp:5});
          admin_field1.value = "";
          admin_field2.value = "";
          admin_field3.value = "";
          loadDropdownOptions1();
        } else {
          mySend({text:"Hiba a gép felvételekor!", tip:"danger", mp:5});
        }
      }
    };
  }

  function gep_szerkesztes() {
    const nev = document.getElementById('admin_field5').value;
    const leltariAzonosito = document.getElementById('admin_field6').value;
    const vonalkod = document.getElementById('admin_field7').value;
    const gep_id = getSelectedOption1().split(',')[0];
    const gepnev = getSelectedOption1().split(',')[1];
    if (!nev || !leltariAzonosito || !vonalkod || !gep_id || !gepnev) {
      mySend({text:"minden mezőt ki kell tölteni!", tip:"danger", mp:5});
      return;
    }

    const data = `${nev},${leltariAzonosito},${vonalkod},${gep_id},${gepnev}`;
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/gep_szerkesztes3?adat=${data}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && xhr.responseText == "Sikeres szerkesztés") {
          mySend({text:"Gép sikeresen szerkesztve!", tip:"success", mp:5});
          admin_field5.value = "";
          admin_field6.value = "";
          admin_field7.value = "";
          loadDropdownOptions1()
        } else {
          mySend({text:"Hiba történt a gép szerkesztésekor!", tip:"danger", mp:5});
        }
      }
    };
  }

  function loadDropdownOptions1() {
    const select = document.getElementById('admin_dropdown1');
    select.innerHTML = ''; // Clear existing options
    fetch('/get_categories1')
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = `${item.AZONOSITO1},${item.ID_GEP}`;
          option.text = `Név:${item.NEV} Azonosito1:${item.AZONOSITO1} ID:${item.ID_GEP}`;
          select.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching categories:', error));
  }

  function getSelectedOption() {
    const select = document.getElementById('admin_dropdown1');
    const selectedValue = select.value;
    return selectedValue;
  }
  document.addEventListener('DOMContentLoaded', loadDropdownOptions1);
  
  function loadDropdownOptions() {
  const select = document.getElementById('admin_dropdown');
  select.innerHTML = ''; // Clear existing options
  fetch('/get_categories')
    .then(response => response.json())
    .then(data => {
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.ID_GEP;
      option.text = `Név:${item.NEV} Tipus:${item.TIPUS} ID:${item.ID_GEP}`;
      select.appendChild(option);
    });
    })
    .catch(error => console.error('Error fetching categories:', error));
  }

function getSelectedOption() {
  const select = document.getElementById('admin_dropdown');
  const selectedValue = select.value;
  return selectedValue;
}

function getSelectedOption1() {
  const select = document.getElementById('admin_dropdown1');
  const selectedValue = select.value;
  return selectedValue;
}
document.addEventListener('DOMContentLoaded', loadDropdownOptions);
function loadOptions() {
  var select = document.getElementById('admin_field4');
  select.innerHTML = '';
  fetch('/adatok')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.AZONOSITO1;
          option.text = item.NEV;
          select.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
function sendSelectedOption() {
            const select = document.getElementById('admin_field4');
            const selectedValue = select.value;       
            xhrAdatSok = new XMLHttpRequest();
            xhrAdatSok.open("get", `/valasztottelem?elem=${selectedValue}`, true);
            xhrAdatSok.send();
            xhrAdatSok.onreadystatechange = function() {
              if (xhrAdatSok.readyState == 4 && xhrAdatSok.status == 200) {
                mySend({text: "Gép törölve!", tip: "success", mp: 5});
                loadOptions();
              }
            };                     
              }         
          document.addEventListener('DOMContentLoaded', loadOptions);
function gep_torles() {
              myQuestion({text: `Biztosan törölni akarod a gépet? `});
              $("#myQuestion").on("click", ".ok", function() {     
                sendSelectedOption();              
              });
            }
            $('#toggle_admin_button').click(function() {
              toggleDiv('admin_div');
            });
            $('#toggle_admin_button2').click(function() {
              toggleDiv('admin_div2');
            });
            $('#toggle_admin_button3').click(function() {
              toggleDiv('admin_div3');
              loadOptions();  
            });
            $('#toggle_admin_button4').click(function() {
              toggleDiv('admin_div4');
            });

            $('#toggle_admin_button5').click(function() {
              backbutton();
              toggleDiv('admin_div5');
            });

           
            $('#toggle_admin_button6').click(function() {
              createBackButton();
              toggleDiv('admin_div7');
            });
        
function kolcsonzesfeltoltes() {
  $('#user_div2').css("display", "none");
  $('#user_div').fadeToggle(300);
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/get_gepek_azonosito2', true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const select = document.getElementById('kolcsonzes_dropdown');
      select.innerHTML = ''; // Clear existing options  
      data[0].forEach(item => {
        const option = document.createElement('option');
        option.text = `${item.a} - ${item.b}`;
        select.appendChild(option);
      });
     
    } else if (xhr.readyState === 4) {
      mySend({text:"Hiba történt az adatok feltöltésekor!", tip:"danger", mp:5});
    }
  };

}

function berlestart() {
  disableButtonTemporarily('gombocska');
  valami = document.getElementById('kolcsonzes_dropdown').value.split(' - ')[0];
  id = tanulodid;
  const xhr = new XMLHttpRequest();
  xhr.open('get', `/gepkiberleses?data=${valami}&data2=${id}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 && xhr.responseText === 'Sikeres') {
        repeatFunctionWithoutFadeToggle(kolcsonzesfeltoltes, 1000);
        mySend({text:"Sikeres bérlés!", tip:"success", mp:5});
      } else {
        mySend({text:"Hiba történt a bérlés közbe!", tip:"danger", mp:5});
      }
    }
  };

}

function berelesbefejezes() {
  const xhr = new XMLHttpRequest();

  xhr.open('get', `/gepkiberlesbefejezes?data=${tanulodid},${document.getElementById('kolcsonzes_dropdown2').value.split(' - ')[0]}&gabor=${document.getElementById('modalInput').value}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 && xhr.responseText === 'Sikeres') {
        repeatFunctionWithoutFadeToggle(kolcsonzestorles, 1000);
        mySend({text:"Sikeresen befejezve!", tip:"success", mp:5});
      } else {
        mySend({text:"Hiba történt a bérlés befejezésekor!", tip:"danger", mp:5});
      }
    }
  };

}

function kolcsonzestorles(){
  $('#user_div2').fadeToggle(300);
  $('#user_div').css("display", "none");
  const xhr = new XMLHttpRequest();
  xhr.open('get',`/get_gepek_azonosito3?data=${tanulodid}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const select = document.getElementById('kolcsonzes_dropdown2');
      select.innerHTML = ''; // Clear existing options  
      data.forEach(item => {
        const option = document.createElement('option');
        option.text = `${item.a} - ${item.b}`;
        select.appendChild(option);
      });
    } else if (xhr.readyState === 4) {
      mySend({text:"Hiba történt a törléskor!", tip:"danger", mp:5});
    }
  };
}
function repeatFunctionWithoutFadeToggle(func, interval) {
  setTimeout(function executeFunction() {
    const originalFadeToggle = $.fn.fadeToggle;
    $.fn.fadeToggle = function() { return this; }; // Override fadeToggle to do nothing
    func();
    $.fn.fadeToggle = originalFadeToggle; // Restore original fadeToggle
  })}
  


// Example usage

function disableButtonTemporarily(buttonId) {
  const button = document.getElementById(buttonId);
  button.disabled = true;
  setTimeout(() => {
    button.disabled = false;
  }, 1500);
}


function berelttorlesadmin(){
  const xhr = new XMLHttpRequest();
  var ez = Array.from(document.getElementById('admin_dropdown9').selectedOptions).map(option => option.value);
  if(ez.length == 0){return}
  xhr.open('get',`/torloadmin?data=${ez}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
  if(xhr.readyState === 4 && xhr.status === 200 && xhr.responseText === 'Sikeres') {
    mySend({text:"Sikeres törlés!", tip:"success", mp:5});
    berlesadminfeltoltes();
  }
  else{
    mySend({text:"Sikertelen törlés!", tip:"danger", mp:5}); 
  }}
};

function berlesadminfeltoltes(){
  const xhr = new XMLHttpRequest();
  xhr.open('get',`/adminberlestorles`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const select = document.getElementById('admin_dropdown9');
      select.innerHTML = ''; // Clear existing options  
      data.forEach(item => {
        const option = document.createElement('option');
        option.text = `${item.a} - ${item.b} - ${new Date(item.c).toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
        option.value = item.d;
        select.appendChild(option);
      });
    } else if (xhr.readyState === 4) {
      mySend({text:"Hiba történt az adatok feltöltésekor!", tip:"danger", mp:5});
    }
  };
}

window.addEventListener('beforeunload', function (e) {
  if (login1_user.innerHTML !== "Login: Még senki....") {
    localStorage.setItem('loggedInUser', login1_user.innerHTML);
    localStorage.setItem('userType', $("#adminbigdiv").css("display") === "block" ? "admin" : "user");
    localStorage.setItem('tanulodid', tanulodid);
  }
  else{
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userType');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userType = localStorage.getItem('userType');
   tanulodid = localStorage.getItem('tanulodid');
  if (loggedInUser && userType) {
    login1_user.innerHTML = loggedInUser;
    $("#login1_modal_button").css("display", "none");
    navbarspan.innerHTML = '<div id="user1_logout_button2" class="button logout" onclick="kijel()">Logout</div>';
    $("#nembelepettkep").css("display", "none");
    if (userType === "admin") {
      $("#belepettkep").css("display", "block");
      $("#adminbigdiv").css("display", "block");
      $("#userbigdiv").css("display", "none");
    } else {
      $("#belepettkep").css("display", "none");
      $("#adminbigdiv").css("display", "none");
      $("#userbigdiv").css("display", "block");

    }
  }
});
function showPasswordModal() {
  const modalHtml = `
    <div class="modal" id="passwordModal" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-secondary text-white">
            <h3 class="modal-title">Jelszó megerősítése</h3>
          </div>
          <div class="modal-body">
            <input type="password" id="passwordInput" class="form-control" placeholder="Jelszó">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" id="logoutButton">Kijelentkezés</button>
            <button type="button" class="btn btn-success" id="okButton">OK</button>
            <button type="button" class="btn btn-danger" id="megse">Mégse</button>
            <button type="button" class="btn btn-success" id="biztos">Biztos</button>
          </div>
        </div>
      </div>
    </div>
  `;
  $("body").append(modalHtml);
  $("#passwordModal").modal('show');

  $("#logoutButton").click(function() {
    $("#megse").css("display", "block");
    $("#biztos").css("display", "block");
    $("#logoutButton").css("display", "none");
    $("#okButton").css("display", "none");
  });
  $("#megse").click(function() {
    $("#megse").css("display", "none");
    $("#biztos").css("display", "none");
    $("#logoutButton").css("display", "block");
    $("#okButton").css("display", "block");
   });
    $("#biztos").click(function() {
      mySend({text:"Sikeres kijelentkezés!", tip:"success", mp:3});
      if (($("#userbigdiv").is(":visible"))) {
        sendTanuloId2();
      }
      $("#user1_logout_button2").css("display", "none");
      $("#login1_user").html("Login: Még senki...." );
      $('#login1_user').prop('title', "[...]");
      $('#login1_modal').modal('hide');
      $('#login1_modal_button').css('display', 'block').click(function() { login_show();  });
      $("#nembelepettkep").css("display", "block");
      $("#belepettkep").css("display", "none");
      $("#userkep").css("display", "none");
      $("#adminbigdiv").css("display", "none");
      $("#admin_div").css("display", "none");
      $("#admin_div2").css("display", "none");
      $("#admin_div3").css("display", "none");
      $("#userbigdiv").css("display", "none");
      $("#user_div").css("display", "none");
      $("#user_div2").css("display", "none");
      $("#user_div3").css("display", "none");
      $("#user_div4").css("display", "none");
      $("#admin_div4").css("display", "none");
      $("#admin_div5").css("display", "none");
      $("#admin_div7").css("display", "none");
      userkijel();
      tanulodid = null;
      valtozo= 0;
      clearInterval(jo);
      clearInterval(jo2);
      $("#passwordModal").modal('hide');
    });

  $("#okButton").click(function() {
    const jelsz = $("#passwordInput").val();
    const user = login1_user.innerHTML;
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/visszabejel?user=${user.toLowerCase()}&jelsz=${jelsz}&tanuloID=${tanulodid}`, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && xhr.responseText === 'Sikeresadmin' || xhr.responseText === 'Sikeresuser') {
          $("#passwordModal").modal('hide');
        } else {
          alert('Hibás jelszó!');
        }
      }
    };
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userType = localStorage.getItem('userType');
  if (loggedInUser && userType) {
    showPasswordModal();
  }
});

function sendTanuloId() {
  const xhr = new XMLHttpRequest();
  xhr.open('get', `/sendTanuloId?tanuloid=${tanulodid}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    } else if (xhr.readyState === 4) {
      console.error('Error sending Tanulo ID:', xhr.statusText);
    }
  };
}
function sendTanuloId2() {
  const xhr = new XMLHttpRequest();
  xhr.open('get', `/sendTanuloId2?tanuloid=${tanulodid}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    } else if (xhr.readyState === 4) {
      console.error('Error sending Tanulo ID:', xhr.statusText);
    }
  };
}




function calculateTimeDifference(date1, date2) {
  const diffInMs = Math.abs(new Date(date1) - new Date(date2));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;
  return `${diffInHours} hours and ${remainingMinutes} minutes`;
}

// Example usage:
const date1 = '2023-10-01T12:00:00';
const date2 = '2023-10-01T14:30:00';

document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.getElementById('admin_dropdown9');
  const button = document.getElementById('admin_button7'); // Replace with your button's ID

  function toggleButtonState() {
    if (dropdown.options.length === 0) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }

  // Initial check
  toggleButtonState();

  // Re-check whenever the dropdown options change
  const observer = new MutationObserver(toggleButtonState);
  observer.observe(dropdown, { childList: true });
});
function admincsvperpill() {
  const rows = [
    ["Név", "Gép", "Kölcsönzés-kezdete"]
  ];

  document.querySelectorAll('#admin_dropdown9 option').forEach(option => {
    const [nev, gep, kolcsonzesKezdete] = option.text.split(' - ');
    rows.push([nev, gep, kolcsonzesKezdete]);
  });

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + rows.map(e => e.join(";")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "adatok.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  mySend({text:"Sikeres exportálás!", tip:"success", mp:5});
}


function szures(){
  document.getElementById('start_date').value = '';
  document.getElementById('end_date').value = '';
}

function sendDates() {
  const startDate = document.getElementById('start_date').value;
  const endDate = document.getElementById('end_date').value;

    if (startDate && endDate) {
      var xhr = new XMLHttpRequest();
      document.getElementById('dataAccordion').innerHTML = "";
      xhr.open('get', `/szuresdatum?start=${startDate}&end=${endDate}`, true);
      xhr.send();
      xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            const uniqueIds = new Set(data.map(item => item.userid)).size;
            let userMap = new Map();
            data.forEach(item => {
              if (!userMap.has(item.userid)) {
              userMap.set(item.userid, { name: item.a, om: item.om, tel: item.tel });
              }
            });

            userMap.forEach((value, key) => {
              var tableHtml = `<div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne${key}">
                        <div class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne${key}" aria-expanded="false" aria-controls="collapseOne${key}">
                        ${value.name} - ${value.om} - ${value.tel}
                        </div>
                      </h2>
                      <div id="collapseOne${key}" class="accordion-collapse collapse" aria-labelledby="headingOne${key}" data-bs-parent="#dataAccordion">
                        <div class="accordion-body">
                        <table class="table">
                          <thead>
                          <tr>
                            <th>Gép</th>
                            <th>Kölcsönzés-kezdete</th>
                            <th>Kölcsönzés-befejezése</th>
                          </tr>
                          </thead>
                          <tbody>`;

              data.forEach(item => {
              if (item.userid === key) {
                tableHtml += `<tr>
                        <td>${item.b}</td>
                        <td>${item.c.replaceAll('T', ' ').replaceAll('.000Z', '')}</td>
                        <td>${item.d ? item.d.replaceAll('T', ' ').replaceAll('.000Z', '') : 'Még folyamatban...'}</td>
                      </tr>`;
              }
              });

              tableHtml += `</tbody>
                    </table>
                    </div>
                  </div>
                  </div>`;
              document.getElementById('dataAccordion').innerHTML += tableHtml;
            });
            mySend({text:"Sikeres szűrés!", tip:"success", mp:5});
           
            $("#datumosadmin").css("display", "none");  
            $("#pdfszures").css("display", "block");        
        } else {
          mySend({text:"Hiba történt a dátum elküldésekor!", tip:"success", mp:5});
        }
      }
      };
    } else {
      mySend({text:"Kérjük adjon meg minden dátumot!", tip:"danger", mp:5});
    }
    setTimeout(() => {window.location.href = '/#dataAccordion';}, 100);
  
    }

function backbutton(){
  $("#datumosadmin").css("display", "block");
  $("#pdfszures").css("display", "none");
  }

  function filterRows() {
    const filterGep = searchInputGep.value.toLowerCase();
    const filterDate = searchInputDate.value.toLowerCase();
    const filterEndDate = searchInputEndDate.value.toLowerCase();
    const rows = document.querySelectorAll('#admin_pdf_table table tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const matchGep = cells[0].textContent.toLowerCase().includes(filterGep);
      const matchDate = cells[1].textContent.toLowerCase().includes(filterDate);
      const matchEndDate = cells[2].textContent.toLowerCase().includes(filterEndDate);
      row.style.display = matchGep && matchDate && matchEndDate ? '' : 'none';
    });
  }

  function filterAccordionRows() {
    const filterName = searchInputName.value.toLowerCase();
    const accordions = document.querySelectorAll('#dataAccordion .accordion-item');
    accordions.forEach(accordion => {
      const headerText = accordion.querySelector('.accordion-button').textContent.toLowerCase();
      const matchName = headerText.includes(filterName);
      accordion.style.display = matchName ? '' : 'none';
    });
  }

    function filterRows1() {
      const filterName = searchInputName1.value.toLowerCase();
      const filterGep = searchInputGep1.value.toLowerCase();
      const filterDate = searchInputDate1.value.toLowerCase();
      const filterEndDate = searchInputEndDate1.value.toLowerCase();
      const filterTerem = searchInputTerem1.value.toLowerCase();
      const rows = document.querySelectorAll('#csvcuccnak table tbody tr');
      rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const matchName = cells[0].textContent.toLowerCase().includes(filterName);
          const matchGep = cells[1].textContent.toLowerCase().includes(filterGep);
          const matchDate = cells[2].textContent.toLowerCase().includes(filterDate);
          const matchEndDate = cells[3].textContent.toLowerCase().includes(filterEndDate);
          const matchTerem= cells[4].textContent.toLowerCase().includes(filterTerem);
          row.style.display = matchName && matchGep && matchDate && matchEndDate && matchTerem ? '' : 'none';
      });
    }
function sendPDF() {
    const modalHtml = `
      <div class="modal" id="inputModal" data-bs-backdrop="static">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
              <h3 class="modal-title">Irja be hogy szeretné menteni a Pdf-et</h3>
            </div>
            <div class="modal-body">
              <input type="text" id="inputField" class="form-control"  oninput="this.value = this.value.replace(/[^A-Za-z0-9öéáőíúóüűÖÜÓÚŰŐÁÉÍ _-]/g, '');" placeholder="PDF neve">
              <input type="text" id="inputField1" class="form-control"  oninput="this.value = this.value.replace(/[^A-Za-z0-9öéáőíúóüűÖÜÓÚŰŐÁÉÍ _-]/g, '');" placeholder="Kiadó">
              <input type="text" id="inputField2" class="form-control"  oninput="this.value = this.value.replace(/[^A-Za-z0-9öéáőíúóüűÖÜÓÚŰŐÁÉÍ _-]/g, '');" placeholder="Kiadó címe">
              <input type="text" id="inputField3" class="form-control"  oninput="this.value = this.value.replace(/[^A-Za-z0-9öéáőíúóüűÖÜÓÚŰŐÁÉÍ _-]/g, '');" placeholder="Kiadó telefonszáma">
              <input type="text" id="inputField4" class="form-control"  oninput="this.value = this.value.replace(/[^A-Za-z0-9öéáőíúóüűÖÜÓÚŰŐÁÉÍ _-]/g, '');" placeholder="Kiadó email címe">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="closeButton">Vissza</button>
              <button type="button" class="btn btn-primary" id="generateButton" disabled>Generálás</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $("body").append(modalHtml);
    $("#inputModal").modal('show');

    $("#closeButton").click(function() {
      $("#inputModal").modal('hide');
      $("#inputModal").remove();
    });

    $('input[id^="inputField"]').on('input', function() {
      const allFilled = $('input[id^="inputField"]').toArray().every(input => $(input).val().trim() !== '');
      $("#generateButton").prop('disabled', !allFilled);
    });

    $("#generateButton").click(function() {
      const inputValue = $("#inputField").val();
      if (inputValue) {
        const content = document.getElementById('admin_pdf_table').innerHTML;
        console.log(content);
        var json = {
          'content' : content.toString(),
          'nev' : $("#inputField").val(),
          'kiado' : $("#inputField1").val(),
          'cim' : $("#inputField2").val(),
          'telefon' : $("#inputField3").val(),
          'email' : $("#inputField4").val()
        }
        $.ajax({
          url:'upload_pdf',
          type:'post',
          contentType:'application/json',
          data:JSON.stringify(json),
          success:function(response){
            mySend({text:"Sikeres generálás!", tip:"success", mp:5});
            $("#inputModal").modal('hide');
            document.getElementById('inputField').value = '';
          },
          error:function(error){
            mySend({text:"Hiba történt a pdf generálás közbe!", tip:"danger", mp:5});
          }
        });
      }
    });
  }



function createBackButton() {
  $("#general_szurotabla").css("display", "none");
  $("#general_mukodj").css("display", "block");
}
function csv_hez_lista(){
  const startDate = document.getElementById('start_date2').value;
  const endDate = document.getElementById('end_date2').value;

    if (startDate && endDate) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', `/szuresdatum2?start=${startDate}&end=${endDate}`, true);
      xhr.send();
      xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if(data.length == 0){
              mySend({text:"Ebben az intervallumban nem volt gépbérlés", tip:"danger", mp:5});
            }
            else{
              let tableHtml = '<table class="table"><thead><tr><th>Név</th><th>Gép</th><th>Kölcsönzés-kezdete</th><th>Kölcsönzés-befejezése</th><th>Teremszám</th></tr></thead><tbody>';
              data.forEach(item => {if(item.d == null){item.d = "Még folyamatban..."}
              tableHtml += `<tr><td>${item.a}</td><td>${item.b}</td><td>${item.c.replaceAll('T', ' ').replaceAll('.000Z', '')}</td><td>${item.d.replaceAll('T', ' ').replaceAll('.000Z', '').replaceAll('null', '')}</td><td>${item.e}</td></tr>`;
              });
              tableHtml += '</tbody></table>'
              $("#general_mukodj").css("display", "none"); 
              $("#general_szurotabla").css("display", "block");
              document.getElementById('csvcuccnak').innerHTML = tableHtml;    
             document.getElementById('start_date2').value = '';
              document.getElementById('end_date2').value = '';
            }
        };
        } 
      }
      }
      else {
        mySend({text:"adja meg mindkét dátumot!", tip:"danger", mp:5});
      };
      setTimeout(() => {window.location.href = '/#csvcuccnak';}, 100);
    } 

    function csvgeneral(){
      const rows = [
        ["Név", "Gép", "Kölcsönzés-kezdete", "Kölcsönzés-befejezése", "Teremszám"]
      ];
      document.querySelectorAll('#admin_div7 table tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        rows.push([cells[0].textContent, cells[1].textContent, cells[2].textContent, cells[3].textContent, cells[4].textContent]);
      });

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + rows.map(e => e.join(";")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "adatok.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      mySend({text:"Sikeres csv létrehozás!", tip:"success", mp:5});
    }

    function toggleDiv(divId) {
      const div = document.getElementById(divId);
      $('div[id^="admin_div"]').not(div).css("display", "none");
      $(div).fadeToggle(300);
    }
    
