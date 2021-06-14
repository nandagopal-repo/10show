const loading = document.querySelector('#loading');
const api_key = '18e911668c4244151b14e89d54d25c29';

// main container:
const page1Container = document.querySelector('#page1Container');
const page2Container = document.querySelector('#page2Container');

// inside of main container:
const showHoldingContainer = document.querySelector('#showHoldingContainer');
const animeHoldingContainer = document.querySelector('#animeHoldingContainer');



// remove existing childeren from the given parent:
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// return response of the given fetch urls:
async function fetchFunction(url){
    loading.style.display = 'visible';
    return await fetch(url)
        .then(response => response.json())
        .then(response => {
            return response;
        })
        .catch(error => console.log(error));
}


// 1.remove all children and create showContainer,
// 2.append showcontainer to popularShowContainer or popularAnimeContainer,
// 3.append popular..container to showHoldingcontainer or animeHoldingContainer,
// 4.append holding..container to page1Container,
// 5.when user clicks name of show -> redirect to next page, save name to localstorgae.
function displayShows(shows,container){
    removeAllChildNodes(container);    
    shows.forEach(show => {
        const showContainer = document.createElement('div');
        let imageSource = show.poster_path;
        if(show.poster_path === '' || show.poster_path === null) return; //edge cases:
        showContainer.classList.add('show-container');
        showContainer.innerHTML = `
            <img class="show-img" loading="lazy" src="https://image.tmdb.org/t/p/w500${imageSource}" alt="show image">
            <div class="show-contents">
                <h2 class="show-title"  id="${show.id}">${show.name}</h2>
                <h2 class="show-rating">${show.vote_average}</h2>
            </div>
        `;
        if(container.className === 'search-results-container'){
            removeAllChildNodes(page1Container);
            container.appendChild(showContainer);
            page1Container.appendChild(container);
        }
        if(container.className === 'popular-show-container'){
            removeAllChildNodes(showHoldingContainer);
            container.appendChild(showContainer);
            showHoldingContainer.appendChild(container)
        }
        if(container.className === 'popular-anime-container'){
            removeAllChildNodes(animeHoldingContainer);
            container.appendChild(showContainer);
            animeHoldingContainer.appendChild(container);
        }

        // when user clicks particular show:
        showContainer.addEventListener('click',(e) => {
            if(e.target.className === 'show-title'){
                let ID = e.target.id;
                localStorage.setItem('show_ID',ID);
                window.location.assign('page2.html');
            }
        });
    });
}


// 1.create new container for the selected show,
// 2.append selected show to the new container,
// 2.append new container to page2container.
function displayParticularShow(show){
    const showTitle = document.createElement('h1');
    showTitle.classList.add('specific-show-name')
    showTitle.textContent = show.name;

    const overviewContainer = document.createElement('div');
    overviewContainer.classList.add('overview');

    let imageSource = show.poster_path;
    overviewContainer.innerHTML = `
        <img class="overview-image" loading="lazy" src="https://image.tmdb.org/t/p/w500${imageSource}" alt="show-image">
        <p class="overview-summary">${show.overview}</p>
        <div class="show-details-container">
            <h3 class="show-details"><strong>Premiered:  </strong>${show.first_air_date}</h3>
            <h3 class="show-details"><strong>Popularity:  </strong>${show.popularity}</h3>
            <h3 class="show-details"><strong>Vote Average:  </strong>${show.vote_average}</h3>
            <h3 class="show-details"><strong>Vote Count:  </strong>${show.vote_count}</h3>
            <h3 class="show-details"><strong>No of seasons:  </strong>${show.number_of_seasons}</h3>
            <h3 class="show-details"><strong>No of episodes:  </strong>${show.number_of_episodes}</h3>
            <h3 class="show-details"><strong>link:  </strong><a href="${show.homepage}" target="_blank">${show.homepage}</a></h3>
        </div>
    `;
    page2Container.appendChild(showTitle);
    page2Container.appendChild(overviewContainer);
}


// 1.get popular 20 shows from the given fetch url,
// 2.call displayShows function for display it.
function getPopularShows(){

    // get 20shows:
    const showUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&language=en-US&sort_by=popularity.desc&append_to_response=images&include_image_language=en,null`;
    let popularShowContainer = document.createElement('div');
    popularShowContainer.classList.add('popular-show-container');
    let popularShows = fetchFunction(showUrl);
    popularShows.then(response => {
        loading.style.display = 'none';
        displayShows(response.results,popularShowContainer);
    });

    
    // get 20animes:
    const animeUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&language=en-US&sort_by=popularity.desc&with_keywords=210024`;
    let popularAnimeContainer = document.createElement('div');
    popularAnimeContainer.classList.add('popular-anime-container');
    let popularAnimes = fetchFunction(animeUrl);
    popularAnimes.then(response => {
        loading.style.display = 'none';
        displayShows(response.results,popularAnimeContainer);
    })
};


// find page1 or page2:
let page = document.body.id;
switch(page){
    case 'homepage':
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
                loading.style.display = 'none';
                let results = response.results;
                console.log(results.length);
                if(results.length === 0) {
                    alert('search results not found!');
                }
                displayShows(results,searchResultsContainer);
            });
            input.value = '';
        });
        getPopularShows();
        break;

    case 'showpage':
        let showId = localStorage.getItem('show_ID');
        let url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${api_key}`;
        let particularShow = fetchFunction(url);
        particularShow.then(response => {
            loading.style.display = 'none';
            displayParticularShow(response);
        });
        break;

    default:
        console.log('something went wrong');
}

