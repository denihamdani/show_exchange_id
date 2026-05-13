import 'dotenv/config';
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;


app.use(express.static("public"));

app.get("/", async (req, res) => {
    
    try {
        const response = await axios.get(process.env.API_CURRENCY_URL);
        let currencyFormat = Intl.NumberFormat("id-ID", {style: "currency", currency:"IDR"});
        let dateFormatter = Intl.DateTimeFormat("id-ID", { dateStyle: 'long' });
        let dateFormatter2 = Intl.DateTimeFormat("id-ID", { dateStyle: 'long', timeStyle: 'long' });
        let tanggal = new Date();
        
        if (response.data !== null) {
            
            tanggal.setTime(response.data.time_last_update_unix * 1000);
            let hasilTanggal = dateFormatter.format(tanggal);
            let hasilTanggalUpdate = dateFormatter2.format(tanggal);
            
            let data = {
                utama: "USD",
                list: ["USD", "EUR", "GBP", "JPY", "SGD", "AUD", "MYR", "THB", "SAR", "CNY", "HKD", "AED"],
                tanggal: hasilTanggal,
                tanggalUpdate: hasilTanggalUpdate,
                time_last_update_unix: response.data.time_last_update_unix,
                time_next_update_unix: response.data.time_next_update_unix,
                conversion_rates: response.data.conversion_rates
            };
            
            res.render("index.ejs", {data: data, currencyFormat: currencyFormat});
        } else {
            res.render("error.ejs");
        }
    } catch (error) {
        res.render("error.ejs");
    }
    
    
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});