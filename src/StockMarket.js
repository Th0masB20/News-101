import {react, useState, useEffect} from 'react';

function StockMarket(){
    const listOfStocks = ['AMZN', 'GOOGL']
    const stockApiKey = '';
    const [data, setData] = useState(null);

    const date = new Date();
        
    useEffect(() =>
    {
        let saveStocks = JSON.parse(localStorage.getItem('stockData'));

        async function fetchData()
        {
            let stockUrl = `https://api.twelvedata.com/time_series?symbol=${listOfStocks.toString()}&interval=1h&date=yesterday&apikey=${stockApiKey}`;

            if(!saveStocks || (saveStocks.date != date.getDate() && saveStocks.month != date.getMonth()))
            {
                try{
                    let data = await fetch(stockUrl);
                    let jsonData = await data.json();
                    setData(jsonData);
                    
                    let dataObject = {data:jsonData, date:date.getDate(), month:date.getMonth()};
                    localStorage.setItem('stockData', JSON.stringify(dataObject));
                }
                catch(e){
                    console.log(e);
                }
            }
            else{
                setData(saveStocks.data);
            }
        }

        fetchData();
    },[]);

    if(data)
    {
        console.log(data);
        for(let stock in data){
            data[stock].values.map((values) => {
                console.log(values.open);
            })
            console.log('-----');
        };

        return <canvas id='stockGraph'></canvas>
    }
}

export default StockMarket;