import './css/header.css';
import { NewsHighlight } from './TopNews';

const CompleteHeader = (prop) => {
    const {topic, changePage, images, circularLL} = prop;
    return (
        <>
            <Navigation topic={topic} changePage={changePage}/>
            <h2 className='section-headers'>Top <span>{topic[0].charAt(0).toUpperCase() + topic[0].substr(1)}</span> News <hr/></h2>
            <header className='header'>
                <TopNewsSection images={images} circularLL={circularLL} topic={topic}/>
            </header>
        </>
    );
}

const TopNewsSection = (prop) => {
    const {images, circularLL, topic} = prop;
    return(
        <section id='top-highlights'>
            <NewsHighlight images ={images}  circularLL={circularLL} topic={topic}/>
        </section>
    );
}

const Navigation = (prop) => {
    const {topic, changePage} = prop;
    return(
        <nav id='navigation-bar'>
            <ul>
                <li><a id='currentPage' onClick={(e) => {updateTopic(e,topic, changePage)}}>Home</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Sports</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Business</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Entertainment</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Health</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Science</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage)}}>Technology</a></li>
            </ul>        
        </nav>      
    )
}

function updateTopic(e,topic,changePage)
{
    if(e.target.innerHTML.toLowerCase() === 'home')
    {
        topic[0] = '';
    }
    else{
        topic[0] = (e.target.innerHTML.toLowerCase());
    }

    if(topic[0] === ''){
        changePage('https://newsapi.org/v2/top-headlines?country=us'); //&apiKeys
    }
    else{
        changePage('https://newsapi.org/v2/top-headlines?country=us&' +`category=${topic[0]}`); //&apiKey
    }

    for(let child of document.getElementById('navigation-bar').children[0].children)
    {
        child.children[0].removeAttribute('id');
    }
    e.target.setAttribute('id','currentPage');

    window.scrollTo(0,0);

}

export default CompleteHeader;