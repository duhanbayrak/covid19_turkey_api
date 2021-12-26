const { data } = require('cheerio/lib/api/attributes');
const { response } = require('express');

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8000,
    request = require('request'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    fs = require('fs');


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function getMinistryOfHealth() {
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
}

function getWorldmeters() {

    const url = 'https://www.worldometers.info/coronavirus/';

    const data = [];

    axios.get(url)
        .then((response) => {
            let $ = cheerio.load(response.data);
            $('tr:nth-child(15) td').each(function (i, e) {
                data[i] = $(e).text();
            })
        })
        .then(() => {
            data.splice(0, 23);
            data.splice(14, data.length);
            const worldmeters_data = {
                countryName: data[0],
                totalCases: data[1].replaceAll(/,/g, "."),
                newCases: data[2].replaceAll(/,/g, "."),
                totalDeaths: data[3].replaceAll(/,/g, "."),
                newDeaths: data[4].replaceAll(/,/g, "."),
                totalRecovered: data[5].replaceAll(/,/g, "."),
                newRecovered: data[6].replaceAll(/,/g, "."),
                activeCases: data[7].replaceAll(/,/g, "."),
                critical: data[8].replaceAll(/,/g, "."),
                totalCases_per_million: data[9].replaceAll(/,/g, "."),
                totalDeaths_per_million: data[10].replaceAll(/,/g, "."),
                totalTests: data[11].replaceAll(/,/g, "."),
                totalTests_per_million: data[12].replaceAll(/,/g, "."),
                population: data[13].replaceAll(/,/g, "."),
            }

            const covidData = JSON.stringify(worldmeters_data);

            console.log(covidData)

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


