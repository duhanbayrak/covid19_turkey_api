const { data } = require('cheerio/lib/api/attributes');
const { response } = require('express');

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8000,
    request = require('request'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    fs = require('fs')


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function getMinistryOfHealth() {
    const url = 'https://covid19.saglik.gov.tr/?lang=tr-TR';


    request(`http://api.scraperapi.com/?api_key=f89659e47f68f3cadea5411c2be1eb91&url=${url}&render=true`, (err, response, body) => {

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

        const data = {
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

        const covidData = JSON.stringify(data);

        console.log(data)

        fs.writeFile('./dataset/data_bakanlik.json', covidData, function (err) {
            if (err)
                console.log(err);
            else
                console.log('Dosyaya başarıyla yazıldı.');

        });

    })
};

function getWorldmeters() {

    const url = 'https://www.worldometers.info/coronavirus/';

    const data = [];

    axios.get(url)
        .then((response) => {
            let $ = cheerio.load(response.data);
            $('tr:nth-child(16) td').each(function (i, e) {
                data[i] = $(e).text();
            })
        })
        .then(() => {
            data.splice(0, 23);
            data.splice(14, data.length);
            const worldmeters_data = {
                countryName: data[0],
                totalCases: data[1].split(",").join("."),
                newCases: data[2].split(",").join("."),
                totalDeaths: data[3].split(",").join("."),
                newDeaths: data[4].split(",").join("."),
                totalRecovered: data[5].split(",").join("."),
                newRecovered: data[6].split(",").join("."),
                activeCases: data[7].split(",").join("."),
                critical: data[8].split(",").join("."),
                totalCases_per_million: data[9].split(",").join("."),
                totalDeaths_per_million: data[10].split(",").join("."),
                totalTests: data[11].split(",").join("."),
                totalTests_per_million: data[12].split(",").join("."),
                population: data[13].split(",").join("."),
            }

            const covidData = JSON.stringify(worldmeters_data);

            console.log(covidData);

            fs.writeFile('./dataset/data_worldmeters.json', covidData, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('Dosyaya başarıyla yazıldı.');

            });

        })
        .catch(function (e) {
            console.log(e);
        });

}
getMinistryOfHealth();
getWorldmeters();

//app.listen(PORT, () => console.log(`Example app listening on port!`));


