import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores){
    return stores.map( store => {
        return  `
            <a href="/store/${store.slug}" class="search__result">
                ${store.name}
            </a>
        `;
    }).join('');

};

function typeAhead(search){
    if (!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results')

    searchInput.on('input', function() {
        if(!this.value) {
            searchResults.style.display = 'none';
            return;
        };

        searchResults.style.display = 'block';

        axios
            .get(`/api/search?q=${this.value}`)
            .then( res => {
                if (res.data.length){
                    searchResults.innerHTML = searchResultsHTML(res.data);
                    //console.log(html);
                }
            })
            .catch(err  => {
                console.error(err)
            });

        //console.log(this.value);
    });

    searchInput.on('keyup', (e) => {

// 40 38 13
        if (![38, 40, 13].includes(e.keyCode)){
            return;
        }
    const activeClass= 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if(e.keyCode === 40 && current ){
        next = current.nextElementSibling ||items[0];
    }else if (e.keyCode === 40){
        next = items[0];
    }else if (e.keyCode === 38 && current) {
        next = current.previousElementSibling ||items[items.lentgh-1];
    }else if (e.keyCode === 40){
        next = items[items.lentgh-1];
    }else if (e.keyCode === 13) {
        window.location = current.href;
        return;
    }
    if (current) {
        current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
        
    });
};



export default typeAhead;