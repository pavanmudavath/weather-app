const inputCity=document.getElementById("inputCity");
const searchButton=document.getElementById("search");
const container=document.getElementById("container");
const autoDetect=document.getElementById("auto-detect");
console.log(inputCity.value);

//My personal Api to Connect is 
//b93b780ebb8ea8b6042ffd7dfa51b87f

//Api for to get the data like weather details
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

//Api to get the latitude and langitude from the cityname.
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


async function getData() {
    if(!inputCity.value.trim()){
        console.log("Please enter a city name.");
        return;
    }
    const geoUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity.value}&limit=5&appid=913ad5ea71fc07a76de02d8142427dff`;
    try{
        const response = await fetch(geoUrl);
        if(!response.ok){
            throw new Error(`Response Status: ${response.status}`);
        }
        const json=await response.json();

        const langitude=json[0].lat;
        const longitude=json[0].lon;
        const weatherUrl=`https://api.openweathermap.org/data/2.5/weather?lat=${langitude}&lon=${longitude}&appid=913ad5ea71fc07a76de02d8142427dff`;
        try{
            const response=await fetch(weatherUrl);
            if(!response.ok){
                throw new Error(`Response Status: ${response.status}`);
            }
            const json=await response.json();
            DisplayData(json)
            console.log(json);
            console.log(json.name);
            console.log(json.sys.country);
            console.log(Math.round(json.main.temp-273.15)); //we getting 294.83 K (Kelvin) so we are doing T(°C)=T(K)−273.15 
            console.log(json.main.humidity);
            console.log(json.wind.speed);
            console.log(Date());

           }catch(error){
            console.log(error.message);
           }

        //ForJsonData(json);
        // console.log(json);
        // console.log(json[0].lat); //get the latitude from the json
        // console.log(json[0].lon);//get the longitude from the json.
    }catch(error){
        console.log(error.message);
    }
}

//To Display the Data in hte WebPAge
 async function DisplayData(json){

                const card=document.createElement("div");
               
                //Location
                const location=document.createElement('p');
                location.innerHTML=`<h1>Location:</h1>${json.name},${json.sys.country}`;
                card.appendChild(location);
                
                //Temparature
                const temparature=document.createElement('p');
                temparature.innerHTML=`<h1>Temparature:</h1>${Math.round(json.main.temp-273.15)}`
                card.appendChild(temparature);
                
                //Humidity
                const humidity=document.createElement('p');
                humidity.innerHTML=`<h1>Humidity:</h1> ${json.main.humidity}`
                card.appendChild(humidity);

                //Wind
                const wind=document.createElement('p');
                wind.innerHTML=`<h1>Wind:</h2> ${json.wind.speed}`
                card.appendChild(humidity);

                //Date
                const currDate=document.createElement('p');
                currDate.innerHTML=`<h1>Date:</h1> ${Date()}`;
                card.appendChild(currDate);

                container.appendChild(card);

               
}

searchButton.addEventListener("click",getData);



//For Location Auto Detection...
autoDetect.addEventListener("click",async()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async(position)=>{
            const lat=position.coords.latitude;
            const lon=position.coords.longitude;
            const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=913ad5ea71fc07a76de02d8142427dff`;
            try{
                const response = await fetch(url);
                if(!response.ok){
                    throw new Error(`Response Status: ${response.status}`);
                }
                    const json=await response.json();
                    DisplayData(json);

                }catch(error){
                    console.log(`Error code ${error.code} - ${error.message}`);
                }
        });

    }else{
        console.log("Geolocation is not supported by this browser .");
    }
});

//This for KeyBoard Enter Button....
inputCity.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"){
        event.preventDefault();
        getData();
    }
})
