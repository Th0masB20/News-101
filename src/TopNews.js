import './css/topNewsStyle.css'
import {useEffect, useState, useRef} from 'react'


function resetZoomAnimation(animationElement,changeCounter){
    for(let child of animationElement.current.children)
    {
        child.removeAttribute('class');
    }
    changeCounter(1);
    animationElement.current.children[0].classList.add('myScale');

}

export const NewsHighlight = (prop) => {
    const {images, circularLL,topic} = prop;

    const [imageUrl,changeUrl] = useState(images[0].url);
    const [pointer, changePointer] = useState(circularLL);
    const [count, changeCounter] = useState(1);
    const animationElement = useRef(null);
    const descriptionAn = useRef(null);

    //when circularLL changes on page change, update initial pointer and change the image on page load
    useEffect(() => {
        changePointer(circularLL); 
        changeUrl(images[0].url); 
    }, [circularLL]);

    //reset animation on page change
    useEffect(() => {
        animationElement.current.style.animation = 'none';
        descriptionAn.current.style.animation = 'none';
        resetZoomAnimation(animationElement,changeCounter);

        setTimeout(() => {
            animationElement.current.style.animation = '';
            descriptionAn.current.style.animation = '';
        }, 5);

    }, [topic[0]]);


    return(
        <a href={imageUrl} target='_blank' id='image-link'>
            <div id='image-grid-container'>
                <section id='image-description'>
                    <p id='gridDescription' className='animate-description' ref={descriptionAn} onAnimationIteration={(e) => changeImageData(e, pointer,changePointer,changeUrl,changeCounter,images,count)}>{pointer.nodeValue}</p>
                </section>
                <div id='image-grid' className='animate-grid' ref={animationElement}>
                    <img className='myScale' src={images[0].urlToImage}/>
                    <img src={images[1].urlToImage}/>
                    <img src={images[2].urlToImage}/>
                </div>
            </div>
        </a>
    );
}


function changeImageData(e = null,pointer, changePointer, changeUrl,changeCounter,images,count){
    let imageGrid = document.querySelector('#image-grid');

    if(count == 3)
    {
        changeCounter(0);
        count = 0;
    }

    for(let child of imageGrid.children)
    {
        child.removeAttribute('class');
    }

    console.log(count);

    changeUrl(images[count].url);
    imageGrid.children[count].setAttribute('class','myScale')
  
    changeCounter(prevCount => prevCount + 1);

    e.target.innerHTML = pointer.nodeValue;
    changePointer(pointer.next);
}
