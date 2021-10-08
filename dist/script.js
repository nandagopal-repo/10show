const loadingAnimation = document.querySelector('#loading');
const page1Container = document.querySelector('#page1Container');
const page2Container = document.querySelector('#page2Container');
const showHoldingContainer = document.querySelector('#showHoldingContainer');
const animeHoldingContainer = document.querySelector('#animeHoldingContainer');
const api_key = '18e911668c4244151b14e89d54d25c29';


function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


async function fetchFunction(url){
    loadingAnimation.style.display = 'visible';
    return await fetch(url)
        .then(response => response.json())
        .then(response => {
            return response;
        })
        .catch(error => console.log(error));
}


function renderShowsandAnime(results,location){
    removeAllChildNodes(location);    
    results.forEach(result => {
        const showContainer = document.createElement('div');
        showContainer.setAttribute("id",`${result.id}`);
        let imageSource = result.poster_path;
        if(result.poster_path === '' || result.poster_path === null) return; //if image not found:
        showContainer.classList.add('show-container');
        showContainer.innerHTML = `
            <img class="show-img" id="${result.id}" src="https://image.tmdb.org/t/p/w500${imageSource}" alt="show image">
            <div class="show-contents">
                <h2 class="show-title"  id="${result.id}">${result.name}</h2>
                <h2 class="show-rating" id="${result.id}">${result.vote_average}</h2>
            </div>
        `;
        if(location.className === 'search-results-container'){
            removeAllChildNodes(page1Container);
            location.appendChild(showContainer);
            page1Container.appendChild(location);
        }
        if(location.className === 'popular-show-container'){
            removeAllChildNodes(showHoldingContainer);
            location.appendChild(showContainer);
            showHoldingContainer.appendChild(location)
        }
        if(location.className === 'popular-anime-container'){
            removeAllChildNodes(animeHoldingContainer);
            location.appendChild(showContainer);
            animeHoldingContainer.appendChild(location);
        }

        // save show id to local storage:
        showContainer.addEventListener('click',(e) => {
            if(e.target.className === 'show-container'){
                let ID = e.target.id;
                localStorage.setItem('show_ID',ID);
                window.location.assign('page2.html');
            }
        });
    });
}


function renderParticularShow(result){
    const showTitle = document.createElement('h1');
    showTitle.classList.add('specific-show-name')
    showTitle.textContent = result.name;

    const overviewContainer = document.createElement('div');
    overviewContainer.classList.add('overview');

    let imageSource = result.poster_path;
    overviewContainer.innerHTML = `
        <img class="overview-image" src="https://image.tmdb.org/t/p/w500${imageSource}" alt="show-image">
        <p class="overview-summary">${result.overview}</p>
        <div class="show-details-container">
            <h3 class="show-details"><strong>Premiered:  </strong>${result.first_air_date}</h3>
            <h3 class="show-details"><strong>Popularity:  </strong>${result.popularity}</h3>
            <h3 class="show-details"><strong>Vote Average:  </strong>${result.vote_average}</h3>
            <h3 class="show-details"><strong>Vote Count:  </strong>${result.vote_count}</h3>
            <h3 class="show-details"><strong>No of seasons:  </strong>${result.number_of_seasons}</h3>
            <h3 class="show-details"><strong>No of episodes:  </strong>${result.number_of_episodes}</h3>
            <h3 class="show-details"><strong>link:  </strong><a href="${result.homepage}" target="_blank">${result.homepage}</a></h3>
        </div>
    `;
    page2Container.appendChild(showTitle);
    page2Container.appendChild(overviewContainer);
}



function getPopularShows(){
    const showUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&language=en-US&sort_by=popularity.desc&append_to_response=images&include_image_language=en,null`;
    let popularShowContainer = document.createElement('div');
    popularShowContainer.classList.add('popular-show-container');
    let popularShows = fetchFunction(showUrl);
    popularShows.then(response => {
        loadingAnimation.style.display = 'none';
        renderShowsandAnime(response.results,popularShowContainer);
    });
};

function getPopularAnime(){
    const animeUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&language=en-US&sort_by=popularity.desc&with_keywords=210024`;
    let popularAnimeContainer = document.createElement('div');
    popularAnimeContainer.classList.add('popular-anime-container');
    let popularAnimes = fetchFunction(animeUrl);
    popularAnimes.then(response => {
        loadingAnimation.style.display = 'none';
        renderShowsandAnime(response.results,popularAnimeContainer);
    })
};


function searchShowsandAnime(){
    const input = document.querySelector('#input');
    const searchBtn = document.querySelector('#btn');
    searchBtn.addEventListener('click',()=>{
        if(input.value === '' || input.value === null) {
            window.location.replace('index.html');
        };
        const inputValue = input.value;
        const url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${inputValue}`;
        let searchResultsContainer = document.createElement('div');
        searchResultsContainer.classList.add('search-results-container');
        let searchShow = fetchFunction(url);
        searchShow.then(response => {
            loadingAnimation.style.display = 'none';
            let results = response.results;
            if(results.length === 0) {
                alert('search results not found!');
            }
            renderShowsandAnime(results,searchResultsContainer);
        });
        input.value = '';
    });
}


// find page1 or page2:
let page = document.body.id;
switch(page){
    case 'homepage':
        searchShowsandAnime();
        getPopularShows();
        getPopularAnime();
        break;

    case 'particularshowpage':
        let showId = localStorage.getItem('show_ID');
        let url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${api_key}`;
        let particularShow = fetchFunction(url);
        particularShow.then(response => {
            loadingAnimation.style.display = 'none';
            renderParticularShow(response);
        });
        break;

    default:
        console.log('something went wrong');
}

