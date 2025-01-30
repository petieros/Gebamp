const express = require("express");
const util = require('util');
const mysql = require("mysql2");
const jspdf = require("jspdf"); 
const path = require("path");
const crypto = require("crypto");
const session = require('express-session');
const app = express();
const hashAlg = "sha256";
const fs = require('fs');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit : '50mb'}))
app.use(bodyParser.urlencoded({limit : '50mb', extended: true}))
const puppeteer = require('puppeteer');
const e = require("express");


 app.use(express.static("public"));

//a szerver elindítása
app.listen(3000, () => {
    console.log("A szerver elindult a 3000. porton...");
})

//mysql adatbázis-kapcsolat
const db = mysql.createConnection({
  connectionLimit: 100,
    host: '193.227.198.214',
    user: 'horvath_mark',
    password: 'Csany4151', 
    database: '2020_horvath_mark',
    port: 9306
  });
 
 



app.get("/adatok", (req, res) => {
  lekerdez("SELECT * FROM gepek_pld where SELEJT = 'N'")
    .then((adatok) => {
      res.json(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});

app.get("/get_categories", (req, res) => {
  lekerdez("SELECT * FROM gepek")
    .then((adatok) => {
      res.json(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});
app.get("/get_categories1", (req, res) => {
  lekerdez("SELECT * FROM gepek_pld where SELEJT = 'N'")
    .then((adatok) => {
      res.json(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});



app.get('/valasztottelem', (req, res) => {
  const id = req.query.elem;
  lekerdez(`UPDATE gepek_pld SET SELEJT = 'Y' WHERE AZONOSITO1 = '${id}'`)
    .then(() => {
      res.send("Sikeres törlés");
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a törlés során");
    });
});


app.get("/gep_felvetel3", (req, res) => {
  const elem1 = req.query.adat.split(',')[0];
  const elem2 = req.query.adat.split(',')[1];
  const elem3 = req.query.adat.split(',')[2];
  const elem4 = req.query.adat.split(',')[3];
  const sql2 = `SELECT COUNT(*) AS i
FROM gepek_pld
WHERE SELEJT = 'N' AND (NEV = '${elem1}' OR AZONOSITO2 = '${elem3}')`;
lekerdez(sql2)
.then((adatok) => {
  if (adatok[0].i != 0) {
    res.send("Már létezik ilyen gép");
  }
  else {
    const sql = `INSERT INTO gepek_pld  VALUES (NULL, ${elem4}, '${elem1}', '${elem2}', '${elem3}', null, 'N');`;
    console.log(sql);
      lekerdez(sql)
        .then(() => {
          console.log("Sikeres felvétel");
          res.send("Sikeres felvétel");
        })
        .catch((hiba) => {
          res.send("Baj");
        });
  }
});
});
app.get("/gep_szerkesztes3", (req, res) => {
  const elem1 = req.query.adat.split(',')[0];
  const elem2 = req.query.adat.split(',')[1];
  const elem3 = req.query.adat.split(',')[2];
  const elem4 = req.query.adat.split(',')[3];
  const elem5 = req.query.adat.split(',')[4];

 

    const sql2 = `SELECT COUNT(*) AS i
    FROM gepek_pld
    WHERE SELEJT = 'N' AND (NEV = '${elem1}' OR AZONOSITO2 = '${elem3}')`;
    lekerdez(sql2)
    .then((adatok) => {
      if (adatok[0].i != 0) {
        res.send("Már létezik ilyen gép");
      }
      else {
        const sql = `UPDATE gepek_pld SET ID_GEP = ${elem5}, NEV = '${elem1}', AZONOSITO1 = '${elem2}', AZONOSITO2 = '${elem3}', SELEJT = 'N' WHERE AZONOSITO1 = "${elem4}"`;

        lekerdez(sql)
          .then(() => {
            res.send("Sikeres szerkesztés");
          })
          .catch((hiba) => {
            console.error(hiba);
            res.status(500).send("Hiba történt a szerkesztés során");
          });
      }
    });


});



  app.get("/jelszoellenorzo", (req,res) => {
    const kuldottJelszo = req.query.pass;
    const kuldottHash = crypto.createHash(hashAlg).update(kuldottJelszo).digest('hex');
    if (kuldottHash == jelszo) res.send(`Access successful`);
    else res.send("Access Denied");
  
  })
  
  
  
  app.get("/bejel", (req,res) => {
    const felhszn = req.query.user.replaceAll("\"","\\\"");
    const jelsz = req.query.jelsz.replaceAll("\"","\\\"");
    lekerdez(`select COUNT(LOGIN) as a FROM users where LOGIN = "${felhszn}"`)
    .then((adat) => {  
      if (adat[0].a != 0){
        lekerdez(`select COUNT(PASSWORD) as a  from users where LOGIN = "${felhszn}" and PASSWORD=md5("${jelsz}")`)
        .then((adat) =>{       
          if (adat[0].a == 0){
            res.send("Nem");}else{
              lekerdez(`select NEV, TANULO_ADMIN, RFID_ADMIN, LELTAR_ADMIN from users where LOGIN = "${felhszn}"`)
              .then((adat2) => {
                res.send(adat2);
              })
            }
        })
      } else {
        res.send("Nem")

      }
    })
  })
  
  app.get("/jelszoellen", (req,res) =>{
    const felhszn =req.query.felhasznalonev;
    const jelszo = req.query.jeszo;
    const atalakitott = crypto.createHash(hashAlg).update(jelszo).digest('hex');
    lekerdez(`select ${felhszn} as a from jelszavak`)
    .then((adat) => {
      if (adat[0].a == atalakitott){
        res.send("jo");
      }else{
        res.send("nem"); 
      }
    })
  })
  
  app.get("/jelszomegvaltoztato", (req,res) =>  {
    var nev = req.query.felhasznalonev;
    var jeszo = req.query.jeszo;
    var valami = crypto.createHash(hashAlg).update(`${jeszo}`).digest('hex');
      const sql = (`update jelszavak set  ${nev} = '${valami}'` );
      db.execute(sql)
  })
  
  app.get("/ujjel", (req,res) =>  {
    var jellszo = req.query.jeszo;
    ko(jellszo);
    var valami = crypto.createHash(hashAlg).update(`${jellszo}`).digest('hex');
      const sql = (`update jelszavak set  ${jelszavasas} = '${valami}'` );
      ko(sql);
      db.execute(sql)
  })
  function lekerdez(sql) {
    return new Promise((resolve, reject) => { //ezzel megvárhatom, hogy végezzen a lekérdezés
      db.execute(sql, (hiba, adatok) => { //mysql-ben így futtatok sql parancsot
        if (hiba) {
          reject(hiba); //a hibakezelő; amit itt átadok, azt kapja meg a kezelő .catch
        } else {
          
          resolve(adatok); //ez a jó lefutás; amit itt átadok, azt kapja meg a kezelő .then
        }
      });
    });
};

app.get("/rfid", (req,res) => {
  const rfid = req.query.rfid.replaceAll("\"","\\\"")
 
  lekerdez(`select COUNT(RFID) as a FROM users where RFID = "${rfid}"`)
  .then((adat) => {
    if (adat[0].a != 0){
       lekerdez(`select NEV as a, ID_USER as b FROM users where RFID = "${rfid}"`)
       .then((adat) => {
        res.send(adat);
       })
    }
    else{
      res.send("Nem")
    }
})
})


app.get("/get_gepek_azonosito3", (req, res) => {
  id = req.query.data;
  const sql = `
  SELECT gepek_pld.AZONOSITO2 as a, gepek.Nev as b
    FROM gep_berles 
    inner JOIN gepek_pld  ON gep_berles.ID_GEP_PLD = gepek_pld.ID_GEP_PLD
    inner JOIN gepek  ON gepek.ID_GEP = gepek_pld.ID_GEP
	WHERE ID_TANULO = ${id} AND gep_berles.BERLES_STOP IS NULL
  `;
  lekerdez(sql)
    .then((adatok) => {
      res.json(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});

app.get("/gepkiberleses", (req, res) => {
  var azonosito1 = req.query.data.toString();
  var id = req.query.data2.toString();

  const checkSql = `SELECT ID_GEP_PLD FROM gepek_pld WHERE gepek_pld.AZONOSITO2 = '${azonosito1}'`;
  lekerdez(checkSql)
    .then((adatok) => {
      if (adatok.length === 0) {
        return res.status(404).send("Nem található ilyen azonosító");
      }  
      const sql = `INSERT INTO gep_berles  VALUES (NULL, ${adatok[0].ID_GEP_PLD}, ${id}, '',CURRENT_TIMESTAMP, null)`;
  lekerdez(sql)
    .then((adatok) => {
      res.send("Sikeres")
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
      res.status(404).send("Hiba történt az adatok lekérdezése során");
    });
    })
    .catch((hiba) => {
      return res.status(500).send("Hiba történt az azonosító ellenőrzése során");
    });
});

app.get("/get_gepek_azonosito2", (req, res) => {

  const sql = `
  SELECT DISTINCT gepek_pld.AZONOSITO2 as a, gepek.Nev AS b, gepek_pld.id_gep
    FROM gepek_pld 
	 inner JOIN gepek  ON gepek.ID_GEP = gepek_pld.ID_GEP
	WHERE gepek_pld.ID_GEP_PLD not IN (select gep_berles.ID_GEP_PLD FROM gep_berles WHERE BERLES_STOP IS NULL) and SELEJT = 'N'
  `;
  lekerdez(sql)
  Promise.all([lekerdez(sql)])
    .then((adatok) => {
      res.send(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});
app.get("/gepkiberlesbefejezes", (req, res) => {
  const id = req.query.data.split(',')[0];
  const azonosito2 = req.query.data.split(',')[1];
  const gabo = req.query.gabor;
  const sql = `UPDATE gep_berles 
inner join gepek_pld on gep_berles.ID_GEP_PLD = gepek_pld.ID_GEP_PLD
SET BERLES_STOP = CURRENT_TIMESTAMP, LEIRAS = '${gabo}'   
 WHERE ID_TANULO = ${id} AND gepek_pld.AZONOSITO2 = '${azonosito2}' AND BERLES_STOP IS NULL`;
  lekerdez(sql)
    .then(() => {
      res.send("Sikeres");
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a frissítés során");
    });
});

app.get("/adminberlestorles", (req, res) => {
  const sql = `
SELECT users.NEV AS a, gepek.NEV AS b, gep_berles.BERLES_START AS c, gep_berles.ID_GEP_BERLES as d
FROM gep_berles
INNER JOIN users ON users.ID_USER = gep_berles.ID_TANULO
INNER JOIN gepek_pld ON gep_berles.ID_GEP_PLD = gepek_pld.ID_GEP_PLD
INNER JOIN gepek ON gepek.ID_GEP = gepek_pld.ID_GEP
WHERE gep_berles.BERLES_STOP IS NULL
  `;
  lekerdez(sql)
    .then((adatok) => {
      res.json(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});
app.get("/torloadmin", (req, res) => {
  var berid = req.query.data.split(',');
  //lekerdez('start transaction');
  var aron = "";
for (var i = 0; i < berid.length; i++) {
  aron += `${berid[i]}, `;
}
var uccso = aron.lastIndexOf(",");
aron = aron.substring(0, uccso);
  const sql = `UPDATE gep_berles SET BERLES_STOP = CURRENT_TIMESTAMP, LEIRAS = 'Admin által kiléptetve' WHERE ID_GEP_BERLES IN (${aron})`;
   lekerdez(sql)
    .then(() => {
      res.send("Sikeres");
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a frissítés során");
    });

//lekerdez('commit');
});

app.get("/visszabejel", (req, res) => {
  const user = req.query.user;
  const jelsz = req.query.jelsz;
  const tanuloID = req.query.tanuloID;
  lekerdez(`SELECT COUNT(*) as count FROM users WHERE NEV = '${user}' and  OM is  null`)
    .then((result) => {
      if (result[0].count == 0) {
        lekerdez(`SELECT COUNT(*) as a FROM users WHERE RFID = '${jelsz}' and NEV = '${user}'`)
          .then((result) => {
            if (result[0].a > 0) {
              const sql = `insert into  kibe values (null,${tanuloID},'in','Weboldal',current_timestamp)`;
              lekerdez(sql)
              res.send("Sikeresuser");      
            }  
            else {
              res.status(401).send("Hibás jelszó");
            }
          })
          .catch((hiba) => {
            res.status(500).send("Hiba történt a jelszó ellenőrzése során");
          });
      } else {
        lekerdez(`SELECT COUNT(*) as count FROM users WHERE PASSWORD=md5("${jelsz}") and NEV = '${user}'`)
          .then((result) => {
            if (result[0].count > 0) {
              res.send("Sikeresadmin");
            } else {
              res.status(404).send("hiba1");
            }
          })
          .catch((hiba) => {
            res.status(500).send("Hiba2");
          });
      }
    })
    .catch((hiba) => {
      res.status(500).send("Hiba3");
    });
});

app.get("/sendTanuloId", (req, res) => {
  const tanuloId = req.query.tanuloid;
  const sql = `insert into  kibe values (null,${tanuloId},'in','Weboldal',current_timestamp)`;
  lekerdez(sql)
    .then((adatok) => {
      res.json('Sikeres Felvétel');
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});

app.get("/sendTanuloId2", (req, res) => {
  const tanuloId = req.query.tanuloid;
  const sql = `insert into kibe values (null,${tanuloId},'out','Weboldal',current_timestamp)`;
  lekerdez(sql)
    .then((adatok) => {
      res.json('Sikeres Felvétel');
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt az adatok lekérdezése során");
    });
});


app.get("/szuresdatum", (req, res) => {
  const start = req.query.start;
  const end = req.query.end

  const sql = `SELECT  users.NEV as a, gepek.NEV as b, gep_berles.BERLES_START as c, gep_berles.BERLES_STOP as d, users.OM as om, users.ID_USER as userid, users.TELEFON as tel
              FROM gep_berles 
              INNER JOIN users ON gep_berles.ID_TANULO = users.ID_USER
              INNER JOIN gepek_pld ON gep_berles.ID_GEP_PLD = gepek_pld.ID_GEP_PLD
              INNER JOIN gepek ON gepek_pld.ID_GEP = gepek.ID_GEP
              WHERE BERLES_START BETWEEN '${start}' AND '${end}' || BERLES_STOP BETWEEN '${start}' AND '${end}' `;

  lekerdez(sql)
    .then((adatok) => {
      res.send(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a felhasználó felvétele során");
    });
});

app.post("/upload_pdf", (req, res) => {
  var nev = req.body.nev;
  var kiado = req.body.kiado;
  var cim = req.body.cim;
  var tel = req.body.telefon;
  var email = req.body.email;

  var content = req.body.content;

  var htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${nev}</title>
  <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .date {
            text-align: right;
            margin-top: 20px;
        }
        .signature, .stamp {
            margin-top: 30px;
        }
        .signature, .stamp {
            width: 45%;
            float: left;
            text-align: center;
        }
        .stamp {
            margin-left: 10%;
        }
        .clear {
            clear: both;
        }
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Kiállító intézmény fejléc -->
    <div class="header">
        <h2>${kiado}</h2>
        <p>Cím: ${cim}</p>
        <p>Telefonszám: ${tel}</p>
        <p>Email: ${email}</p>
    </div>
    
    <!-- Dátum -->
    <div class="date">
        <p>Dátum: <span id="currentDate"></span></p>
    </div>
    <div>
    ${content}
    </div>
    <!-- Aláírás és pecsét hely -->
    <div class="signature">
        <p>Aláírás:</p>
        <hr style="width: 50%; margin: 0 auto;">
    </div>

    <div class="stamp">
        <p>Pecsét hely:</p>
        <hr style="width: 50%; margin: 0 auto;">
    </div>

    <div class="clear"></div>
</div>

<script>
    // Aktuális dátum megjelenítése
    const today = new Date();
    const dateString = today.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
</script>

</body>
  </html>
  `;

  const __dirname = path.resolve("C:/Letöltések");
  const filePath = path.join(__dirname, `index.html`);
  fs.writeFile(filePath, htmlContent, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Hiba történt a fájl mentése során");
    } else {
      res.send("Fájl sikeresen mentve");
      (async () => {
        // Indítsd el a böngészőt
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        // Olvasd be a HTML fájlt
        const htmlPath = path.join(__dirname, 'index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
      
        // Állítsd be a HTML tartalmat a Puppeteer oldalra
        await page.setContent(html);
      
        // Generáld le a PDF-et
        await page.pdf({
          path: `${__dirname}/${nev}.pdf`,
          format: 'A4',
          margin: {
            top: '20mm',   // felső margó
            bottom: '20mm', // alsó margó
            left: '20mm',   // bal margó
            right: '20mm'   // jobb margó
          },
          printBackground: true // Ha a háttér színek is fontosak
        });
      
        // Zárd be a böngészőt
        await browser.close();
        fs.unlink(htmlPath, (err) => {
          if (err) {
            console.error("Hiba történt a fájl törlése során:", err);
          } else {
            console.log("Fájl sikeresen törölve");
          }
        });
      })();
    }
  });
});

app.get("/szuresdatum2", (req, res) => {
  const start = req.query.start;
  const end = req.query.end

  const sql = `SELECT  users.NEV as a, gepek.NEV as b, gep_berles.BERLES_START as c, gep_berles.BERLES_STOP as d, gepek_pld.AZONOSITO2 as e
              FROM gep_berles 
              INNER JOIN users ON gep_berles.ID_TANULO = users.ID_USER
              INNER JOIN gepek_pld ON gep_berles.ID_GEP_PLD = gepek_pld.ID_GEP_PLD
              INNER JOIN gepek ON gepek_pld.ID_GEP = gepek.ID_GEP
              WHERE BERLES_START BETWEEN '${start}' AND '${end}' || BERLES_STOP BETWEEN '${start}' AND '${end}' `;

  lekerdez(sql)
    .then((adatok) => {
      res.send(adatok);
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a felhasználó felvétele során");
    });
});


app.get("/userlogout", (req, res) => {
  const sql = `update gep_berles set BERLES_STOP = CURRENT_TIMESTAMP where ID_TANULO = ${req.query.tanuloid} and BERLES_STOP IS NULL`;
  lekerdez(sql)
    .then((adatok) => {
      res.json('Sikeres befejezés');
    })
    .catch((hiba) => {
      res.status(500).send("Hiba történt a bérlet lezárása során");
    });
});