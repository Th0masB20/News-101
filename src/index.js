import react, {useState, useEffect} from 'react';
import reactDom from 'react-dom/client';
import CompleteHeader from './Header';
import { CircularLinkedList } from './CircularLL';
import StockMarket from './StockMarket';
import './css/style.css';



const apiKey = '';
const topic = [''];
let images = [];
let circularLL;
const date = new Date();

const MainBody = (prop) => {
    const {data,changePage} = prop

    if(data && data.status == 'ok')
    {
        return(
            <>
                <main id='main-body'>
                    <CompleteHeader topic={topic} changePage={changePage} images={images} circularLL={circularLL}/>
                    {topic[0] === 'business'? <StockMarket/>: null}
                    <MainNewsSection data={data} images={images}/>
                </main>
            </>
        );
    }
}

function MainNewsSection(props){
    const {data, images} = props;
    return(
        <>
            <h2 className='section-headers'>Other News <hr/></h2>
            <section id='bottom-grid-layout'>
                    {data.articles.map((d, index) => {
                        if(!images.find((insideD) => insideD === d ) && d.title!='[Removed]' && d.description != null && d.author != null)
                        {
                            return <ArticleComponent {...d} key={index}/>
                        } 
                        }
                    )} 
            </section>
        </>
    );
}

function ArticleComponent(props){
    const {title, description, urlToImage, url} = props;
    return(
        <div className='article-body'>
            <ImageComponent urlToImage={urlToImage} url={url}/>            
            <Description description={description} url={url} title={title}/>
        </div>
    )
}

function ImageComponent(prop){
    const {urlToImage,url} = prop;
    return(
        <>
            <div id='image-container'>
                <img src={urlToImage} className='article-image'/>
                <div><a href={url} className='link' target='_blank'>Read more</a></div>
            </div>
        </>
    )
}
function Description(props){
    const {title, description} = props;
    return(
        <>
            <div className='flex-description'>
                <p className='title'>{title}</p>
                <p className='desctiption'>{description}</p>
            </div>  
        </>
    )
}

function Background(props){
    const {topic, changePage} = props
    return(
        <div id='background-div'>
            <h1 id='logo' onClick={() => goToHome(topic, changePage)}> News 101</h1>
        </div>
    );
}

//fetches data and displays background and main section
function PageComponent(){
    const [url, changePage] = useState('https://newsapi.org/v2/top-headlines?country=us');
    const [data, fetchData] = useState(null);

    let myCache = JSON.parse(localStorage.getItem('myCache'));

    if(!myCache)
    {
        myCache = [];
    }

    useEffect(() =>{
        circularLL = null;
        circularLL = new CircularLinkedList();
        images = [];

        const getData = async () =>{
            let cachedPage = myCache.find((object) => object.page === topic[0]);

            if(!cachedPage || cachedPage.time != date.getHours() || cachedPage.date != date.getDate() || cachedPage.month != date.getMonth())
            {
                try{
                    const data = await fetch(url + `&apiKey=${apiKey}`);
                    const parsedData = await data.json(); 
                    
                    if(cachedPage)
                    {
                        console.log(cachedPage);
                        cachedPage.data = parsedData;
                        cachedPage.time = date.getHours();
                        cachedPage.date = date.getDate();
                        cachedPage.month = date.getMonth();
                    }
                    else{
                        myCache.push({page:topic[0], data: parsedData, time:date.getHours(), date:date.getDate(), month:date.getMonth()});
                    }

                    localStorage.setItem('myCache', JSON.stringify(myCache));
                    fetchData(parsedData);
                }
                catch(e){
                    console.log(e);
                }
            }
            else{
                const getJson = JSON.parse(localStorage.getItem('myCache'));
                let fetchedData = getJson.find((object) => object.page === topic[0]).data;
                fetchData(fetchedData);
            }
        }

        getData();
    },[url]);

    if(data != null)
    {
        loadLinkedList(circularLL, images, data);
    }

    return(
        <>
            <Background topic={topic} changePage={changePage}/>
            <MainBody data={data} changePage={changePage}/>
        </>
    )
}

function goToHome(topic, changePage){
    topic[0] = '';
    changePage('https://newsapi.org/v2/top-headlines?country=us');
}


function loadLinkedList(circularLL, images, data){

    for(let d of data.articles)
    {
        if(d.title!='[Removed]' && d.description != null && d.author != null)
        {
            images.push(d);
            circularLL.addNext(d.title);
            if(images.length == 3) return;
        } 
    }
}


const root = reactDom.createRoot(document.getElementById('root'));
root.render(<PageComponent/>);