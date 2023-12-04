import { useRef } from 'react';
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
    const root = document.querySelector(':root');
    const navLinks = useRef(null);
    return(
        <nav id='navigation-bar'>
            <div id='dropDownMenu' onClick={() => showDropDown(root)}>Home</div>
            <ul ref={navLinks}>
                <li><a id='currentPage' onClick={(e) => {updateTopic(e,topic, changePage,root)}}>Home</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Sports</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Business</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Entertainment</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Health</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Science</a></li>
                <li><a onClick={(e) => {updateTopic(e,topic,changePage,root)}}>Technology</a></li>
            </ul>        
        </nav>      
    )
}

function showDropDown(root){
    root.style.setProperty('--dropDownDisplay','block');
}

function updateTopic(e,topic,changePage,root)
{
    let navBar = document.querySelector('#navigation-bar');
    let dropDownMenu = document.querySelector('#dropDownMenu');

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

    for(let child of navBar.children[1].children)
    {
        child.children[0].removeAttribute('id');
    }

    e.target.setAttribute('id','currentPage');
    dropDownMenu.innerHTML = e.target.innerHTML;
    root.style.setProperty('--dropDownDisplay','none');

    window.scrollTo(0,0);
}

export default CompleteHeader;