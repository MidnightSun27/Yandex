document.getElementById('inp')
    .addEventListener('click', event => {
        const input = document.getElementById(event.target.id);
        let wrap;
        let list = document.createElement('div');
        const selector = `.${input.className}`;
        if (input.className === 'inputs__from') {
            wrap = document.getElementById('wrap1');
            list.className = 'autocomplete-list_from';
        } else if (input.className === 'inputs__to') {
            wrap = document.getElementById('wrap2');
            list.className = 'autocomplete-list_to';
        }
        wrap.appendChild(list);
        input.addEventListener('input', () => debounced(getSuggest(input.value, selector, list)));
    });

const getSuggest = async (searchText, selector, list) => {
    list.innerHTML = '';
    const listSelector = `.${list.className}`;
    console.log(listSelector);
    if (searchText.length >= 3) {
        let matches = await fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${searchText}&limit=10`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "0e8d2f8171msh11204857f76591fp10c861jsn000790f0b64d",
                "x-rapidapi-host": "aerodatabox.p.rapidapi.com"
            }
        })
            .then(status)
            .then(response => response.json());

        let suggest = matches.items;
        suggest.forEach(place => {
            let item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.tabIndex = 1;
            item.innerHTML = `${place['municipalityName']}  ${place['shortName']} (${place['iata']})`;
            list.appendChild(item);
            item.addEventListener('click', function () {
                document.querySelector(selector).value = item.textContent;
                document.querySelector(listSelector).style.display='none';
            });
        });
    }
};

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

let debounce = function (f, delay) {
    let timer;
    return function () {
        if (timer) clearTimeout(timer);
        let args = arguments;
        timer = setTimeout(function () {
            f.apply(null, args);
        }, delay);
    };
};

let debounced = debounce(getSuggest, 4000);