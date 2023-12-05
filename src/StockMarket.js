import {react, useState, useEffect} from 'react';
import { Chart as CartJS} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import './css/graph.css'

function StockMarket({stockApiKey}){
    const listOfStocks = ['HPQ', 'GOOGL']
    const [data, setData] = useState(null);

    const date = new Date();

    const chartOptions = {
        plugins: {
          legend: {
            display: false,
          },           
        },
        elements: {
            point:{
                radius: 0
            }
        },
        scales:{
            x:{
                ticks: {
                    display: false,
                },
                grid:{
                    display:false,
                }
            },

            y:{
                ticks:{
                    display:false,
                },
                grid: {
                    display: false,
                  },
            }
            
        }
      };
        
    useEffect(() =>
    {
        let saveStocks = JSON.parse(localStorage.getItem('stockData'));

        async function fetchData()
        {
            let getLastOpenDate = `https://api.twelvedata.com/eod?symbol=${listOfStocks.toString()}&apikey=${stockApiKey}`
            
            if(!saveStocks || saveStocks.date != date.getDate() || saveStocks.month != date.getMonth())
            {
                try{
                    //gets last stock market open date
                    let dateData = await fetch(getLastOpenDate);
                    let jsonDate = await dateData.json();

                    let stockUrl = `https://api.twelvedata.com/time_series?symbol=${listOfStocks.toString()}&interval=5min&date=${jsonDate[listOfStocks[0]].datetime}&apikey=${stockApiKey}`;

                    //gets actual stocks
                    let data = await fetch(stockUrl);
                    let jsonData = await data.json();
                    setData(jsonData);
                    console.log(jsonData);
                    
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
        let dataset = [];
        let timeLabel = [];

        for(let stock in data){
            dataset.push(data[stock].values.map((values) => values.open));
            timeLabel.push(data[stock].values.map((values) => {
                let dateArr = values.datetime.split(' ');
                return dateArr[1];
            }
            ))
        }

        return(
            <>
            <h2 className='section-headers'>Stocks<hr/></h2>
            <div id='graphContainer'>
                <section className='graphSection'>
                    <Graph listOfStocks={listOfStocks} timeLabel={timeLabel} dataset={dataset} chartOptions={chartOptions} stockIndex={0}/>
                </section>
                <section className='graphSection'>
                    <Graph listOfStocks={listOfStocks} timeLabel={timeLabel} dataset={dataset} chartOptions={chartOptions} stockIndex={1}/>
                </section>
            </div>
            </>
        );
    }
}


function Graph({listOfStocks, timeLabel, dataset, chartOptions, stockIndex})
{
    let color = dataset[stockIndex][0] >= dataset[stockIndex][dataset[stockIndex].length - 1] ? 'red':'green';
    let backgroundColor = color == 'red'? 'rgba(255,0,0,0.2)':'rgba(0,255,0,0.2)';
    return(
        <>
        <h3 className='stockDescription'>{listOfStocks[stockIndex]}:</h3>
        <Line data={{
            labels:timeLabel[stockIndex],
            datasets:[
            {
                label:listOfStocks[stockIndex],
                data: dataset[stockIndex],
                borderColor:color,
                backgroundColor:backgroundColor,
                tension:0.5,
                fill:{
                    target:'origin',
                },
            }
            ]
        }} options={chartOptions} className='graphStyle'/>
        </>
    )
}

export default StockMarket;