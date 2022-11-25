import React, {useEffect, useState} from 'react'
import './App.scss';
import Species from './Species';


const API_URL = 'https://swapi.dev/api/species/?search=';
const SPECIES_IMAGES = {
    droid:
        'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
    human:
        'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
    trandoshan:
        'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
    wookie:
        'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
    yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;


/*
Parses from Cm to Inches and adds " to make it a String
*/
const cmToInches = (cmValue)=>{
    return (cmValue / CM_TO_IN_CONVERSION_RATIO).toFixed(0)+'"'
}


/*
Parses the state depending on if it's an error, loading or th actual data coming from Api
(Take in notice that SPR from Solid was stopped here since it could be go further)

*/
const parseService = (isError, errorMessage,  isLoading, loadingMessage, data)=>{
    return {
        name: isError ? errorMessage : (isLoading ? loadingMessage : data.name),
        language:isError ? errorMessage : isLoading ? loadingMessage :data.language,
        designation:isError ? errorMessage : isLoading ? loadingMessage :data.designation,
        classification:isError ? errorMessage : isLoading ? loadingMessage : data.classification,
        height: isError ? errorMessage : isLoading ? loadingMessage : data.average_height === 'n/a' ? data.average_height :  cmToInches(data.average_height),
        numFilms:isError ? 0 : isLoading ? 0 : data.films.length
    }
}





/*
Fetching logic is separated as a service. Here the http error codes could be sent to the parser depending the result
*/
const fetchService = (searchParam, setData)=> {
    return fetch(API_URL+searchParam)
        .then(res => res.json())
        .then((res)=>{setData(parseService(false,'', false,'', res.results[0]))})
        .finally()
        .catch(()=>{setData(parseService(true, 'Error'))})
 }




 const stateHook = (specie) => {
     const [data, setData] = useState(parseService(false,'Error', true, 'Loading'));
     useEffect(()=>{fetchService(specie, setData)}, []);
     return data
 }


const SpeciesCardList = (children)=>Object.keys(children).map((specie, key) => {
    return(<Species  {...stateHook(specie)} key={key} image={children[specie]}/>)
})


function App() {
    return (
        <div className="App">
        <React.StrictMode>
            <h1>Empire Strikes Back - Species Listing</h1>
            <div className="App-species">
               <SpeciesCardList {...SPECIES_IMAGES}/>
            </div>
        </React.StrictMode>
        </div>
    );
}

export default App;

