console.log('In Content Script');

var intervalId = setInterval(function(){
    console.log('I am in bg JS');
    let header = document.querySelector(".slds-global-header");
    if(header){
        console.log('In Header');
        header.style.backgroundColor = "lawngreen";
        clearInterval(intervalId);
    }
},500);
