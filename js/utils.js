import { cdnUrl } from "./env.js";
// istedenfor å håndtere hver gang vi trenger et bilde med split 
// lager vi en stætte funksjon som returnere bildet ferdig behandlet

export function handleImage(keyImage, customClass = 'basic-image') {
    // vi trenger fast url av cdn + verdi i index 1, 2 og 3
    /*['image', 'dsefs45tfsrgfg5ge', '1200x800', 'jpg'] eksempel av cover
    */
    const imageArray = keyImage.split('-');
    const image = document.createElement('img');
    image.classList.add(customClass);
    image.setAttribute('src', `${cdnUrl}${imageArray[1]}-${imageArray[2]}.${imageArray[3]}`);
    return image;
    
}


  

export function handleImageStyle(keyImage) {
    // vi trenger fast url av cdn + verdi i index 1, 2 og 3
    /*['image', 'dsefs45tfsrgfg5ge', '1200x800', 'jpg'] eksempel av cover
    */
    const imageArray = keyImage.split('-');

    
    return  (`${cdnUrl}${imageArray[1]}-${imageArray[2]}.${imageArray[3]}`);
}


// vi trenger en støtte funksjon som håndtere objekt av block element
export function handleParagraphs(body) {
    const text = document.createElement('article');
    if (body) {
        body.map(p => {
            if(p._type === 'block') {
                if(p.style === 'h2') {
                    const newp = document.createElement('h2');
                    newp.innerText = p.children[0].text;
                    text.append(newp); 
                }
                if(p.style === 'normal') {
                    const newp = document.createElement('p');
                    newp.innerText = p.children[0].text;
                    text.append(newp); 
                }
            }
            if(p._type === 'image') {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container-article');
                imgContainer.append(handleImage(p.asset._ref));
                text.append(imgContainer);
            }
        })
    };
    return text;
}
//document.querySelector('img-container-article').forEach(function(el, i){
  //  el.id = i;
  //el.classList.add('img-class');
  //});


