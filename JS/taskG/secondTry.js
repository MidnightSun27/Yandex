
const from = document.getElementById('from');
const next = document.getElementById('to');
let wrap2 = document.createElement('div');
wrap2.className = 'autocomplete-wrap_to';
next.parentNode.insertBefore(wrap2, next);
wrap2.appendChild(next);
let list2 = document.createElement('div');
list2.className = 'autocomplete-list_to';
wrap2.appendChild(list2);

let wrap1 = document.createElement('div');
wrap1.className = 'autocomplete-wrap_from';
from.parentNode.insertBefore(wrap1, from);
wrap1.appendChild(from);
let list1 = document.createElement('div');
list1.className = 'autocomplete-list_from';
wrap1.appendChild(list1);




const suggest = async (searchText, selector, list) => {
    list.innerHTML = '';
    if (searchText.length >= 3){
        let matches = await fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${searchText}&limit=10`,{
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "0e8d2f8171msh11204857f76591fp10c861jsn000790f0b64d",
                "x-rapidapi-host": "aerodatabox.p.rapidapi.com"
            }
        })
            .then(response => response.json());

        let suggest = matches.items;
        suggest.forEach(place => {
            let item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.tabIndex=1
            item.innerHTML = `${place['municipalityName']}  ${place['shortName']} (${place['iata']})`
            list.appendChild(item);
            item.addEventListener('click', function() {
                document.querySelector(selector).value= item.textContent;
                document.getElementsByClassName("autocomplete-list_from").style.display='none';
            });
        })
    }
};

from.addEventListener('input', () => suggest(from.value, '.inputs__from', list1));
next.addEventListener('input', () => suggest(next.value, '.inputs__to', list2));

