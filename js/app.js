
import { cdnUrl, projectID } from './env.js';
import { handleImage, handleImageStyle } from './utils.js';
import { handleParagraphs } from './utils.js';

function init() {
    const urlString = window.location.search;
    const paramsUrl = new URLSearchParams(urlString);
    const pageValue = paramsUrl.get('page')

    //const burgerIcon = document.querySelector('.burger-icon');
    //const mobileNav = document.querySelector('.mobile-nav');
    //burgerIcon.addEventListener('click', () => {
      //  mobileNav.classList.toggle('mobile-nav-hide');
        //burgerIcon.classList.toggle('burger');
        //burgerIcon.classList.toggle('closemobilemenu');
    //});

    

    if(pageValue === null) {
        getPosts(); 
    } else {
        getPost(pageValue);
    }
}

// følgende er funksjonen for å hente en singel post/projekt
// NB. = projectID variable kommer fra env.js fil
async function getPost(pageValue) {

  
    console.log(projectID);
    console.log(pageValue);
    const project = document.querySelector('.body-text');
    const post = await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
    [slug.current == "${pageValue}"]
    `);
    const { result } = await post.json();
    console.log(result[0]);
    const projectTitle = document.querySelector('.heading');
    projectTitle.innerText = result[0].title
    const cover = document.querySelector('.main-image');
    cover.setAttribute('style',`background-image: url('${handleImageStyle (result[0].mainImage.asset._ref)}')`);
    console.log(project);
    project.append(handleParagraphs(result[0].body));

}

// følgende er en async støtte funksjon for å hente data fra sanity
// bygge alle blokker i forsiden som representer prosjekter
// funksjonen må være asynkron siden innhenting kan ta tid (millisekunder) 
async function getPosts() {
  /* her lager vi en variabel hvor vi lagre inn data som kommer fra sanity.io
  fetch er javascript funksjon som venter på url argument 
  i vår tilfeldig url er sanity endpoint med query for filtrere bare post (prosjekter) 
  siden fetch er en "Promise" må vi bruke await [_type == "post"] filtrerer bare content type "post"*/
  // NB. = projectID variable kommer fra env.js fil
  const posts =  await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
  [_type == "post"]
  `);
  /* etter fetch har ferdig returnere en http response objekt og vi henter ut av det
  result underobjekt ved hjelp av en til funksjon av javascript json()*/
  const { result } = await posts.json();
  /* result er nå en array av objekter med data vi skriver i vår sanity.studio */
  

  // her definerer vi inn i en variabel hvor vi kommer til å bygge de blokkene med prosjekter
  const worksList = document.querySelector('.workslist');

  // nå trenger vi å loop inn i resultat fra sanity med en forEach
  // forEach går gjennom hele array av objekter og sender til en funksjon en objekt etter hverandre
  // jeg kalte "post" hver objekt som er sent in in forEach
  // så "post" innholder verdi av hver eneste prosjekt

  console.log(result)

  result.forEach(post => {
      
      // vi begynne å bygge block med createElement og blokken er en <a href="">
      const workBlock = document.createElement('a'); // vi bygget her <a></a>
      workBlock.classList.add('item'); // vi legger til en class til <a class="work"></a>
      workBlock.setAttribute(
          'href', 
          `./project.html?page=${post.slug.current}`

      ); // her legge vi til attribute href med slug verdi inn <a class="work" href="./work.html/tittel-2"
      workBlock.setAttribute('aria-label', post.title);

      console.log(post.mainImage.asset._ref)

      workBlock.setAttribute('style', `background-image: url('${handleImageStyle (post.mainImage.asset._ref)}')`,)
    // vi trenger en h2 element inn i hoved block
    // const workTitle = document.createElement('h2'); // vi lagd <h2></h2> her
    // workTitle.classList.add('work-title'); // <h2 class="work-title"></h2>
    //workTitle.innerText = post.title; // inn i tag skriver vi verdi fra post.title
    //workBlock.append(workTitle); // vi legger til h2 element inn i <a> block
    //const workMask = document.createElement('div'); // vi lager div mask
    //workMask.classList.add('work-mask'); // <div class="work-mask"></div>
    //workBlock.append(workMask); // og legge vi inn <div> inn i <a> block
      //Bildet håndtering
      // det som følger etter trenger vi for å hente bilder fra sanity CDN plattform 
      // vi henter reference og skriver vi inn et element <img>
      const workCover = document.createElement('img'); // her bigger vi element img
      // som trenger en attribute image fra sanity objekt
      // med split for jeg ut veriene for å bygge url av bildet
      const cover = post.mainImage.asset._ref.split('3'); // her har vi array med 4 verdi av bildet
      // vi trenger fast url av cdn + verdi i index 1, 2 og 3
      /*['image', 'dsefs45tfsrgfg5ge', '1200x800', 'jpg'] eksempel av cover
      */
      workCover.setAttribute('src', `${cdnUrl}${cover[1]}-${cover[2]}.${cover[3]}`);

      worksList.append(workBlock); // til slutt legge vi inn hele <a> block inn i worklist section
  });


}

init();



