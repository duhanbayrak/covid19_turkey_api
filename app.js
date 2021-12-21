const { data } = require('cheerio/lib/api/attributes');
const { response } = require('express');

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8000,
    nodemon = require("nodemon"),
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const url = 'https://covid19.saglik.gov.tr/?lang=tr-TR';


request(`http://api.scraperapi.com/?api_key=e28d1175a925dd4a325f0a54ba5bdafd&url=${url}&render=true`, (err, response, body) => {

    const html = response.body;

    const $ = cheerio.load(html);

    const date = $('.asidozuguncellemesaati').text(),
        todayCases = $('.bugunku-vaka-sayisi').text(),
        todayDeaths = $('.bugunku-vefat-sayisi').text(),
        todayRecovered = $('.bugunku-iyilesen-sayisi').text(),
        todayTests = $('.bugunku-test-sayisi').text(),
        first_vaccines_ratio = $('.dozturkiyeortalamasi').text(),
        second_vaccines_ratio = $('.doz2turkiyeortalamasi').text(),
        first_vaccines = $('.doz1asisayisi').text(),
        second_vaccines = $('.doz2asisayisi').text(),
        third_vaccines = $('.doz3asisayisi').text(),
        total_vaccines = $('.toplamasidozusayisi').text();

    let data = {
        date: date,
        todayCases: todayCases,
        todayDeaths: todayDeaths,
        todayRecovered: todayRecovered,
        todayTests: todayTests,
        first_vaccines_ratio: first_vaccines_ratio,
        second_vaccines_ratio: second_vaccines_ratio,
        first_vaccines: first_vaccines,
        second_vaccines: second_vaccines,
        third_vaccines: third_vaccines,
        total_vaccines: total_vaccines
    }
    
    var duhan = fs.readFile('dataset/data.json');
                    
    const covidData = JSON.stringify(data, null, 4);

    console.log(data)

    fs.writeFile('dataset/data.json', covidData, function (err) {
        if (err)
            console.log(err);
        else
            console.log('Dosyaya başarıyla yazıldı.');
            
    });

})


app.listen(PORT, () => console.log(`Example app listening on port!`));


