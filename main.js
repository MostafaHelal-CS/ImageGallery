// Api authorization Key
const APIKey='u144d0ovT4E0pyU5yf6oJafhi4DmQSSn73muhxacaxrfkpgmzEGY066w';
// Seclect cards container
let theCardContainer=document.querySelector(".cards");
// Select load more buttons
let loadMore=document.getElementById("load__more");

// Select the input search
let theInput=document.getElementById("input-search");

// Select the overlay
let theOverlay=document.querySelector(".overlay");

// Select overlay-bg
let overlayBg=document.querySelector('.overlay .overlay-bg');


// Number of images per page
const numberOfImagePerPage=15;
// the current page
let currentPage=1;

let searchval=null;


window.onload=function () {
    theInput.focus();
};
// function to create image in the dom body

const generateImageDom=function (images) {
    images.forEach((img) => {
        theCardContainer.innerHTML+=`
        <div class="card" onclick="ShowOverlay('${img.src.large2x}' , '${img.photographer}')">
            <img src="${img.src.large2x}" alt="">
            <div class="photographer__details">
                <div class="name">
                    <i class="fa-solid fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <i class="fa-solid fa-download" onclick="downloadingImage('${img.src.large2x}')"></i>
            </div>
        </div>
    `;
    });
};


function ShowOverlay (imgSrc, photographerName) {
    theOverlay.classList.add("show");
    overlayBg.innerHTML=`
        <div class="photographer__details">
            <div class="name">
                <i class="fa-solid fa-camera"></i>
                <span>${photographerName}</span>
            </div>
            <div class="icons">
                <i class="fa-solid fa-download" onclick="downloadingImage('${imgSrc}')"></i>
                <i class="fa-solid fa-close" onclick="hideOverlay()"></i>
            </div>
        </div>
        <div class="preview__image">
            <img src="${imgSrc}" alt="">
        </div>
    `;
}


function hideOverlay () {
    theOverlay.classList.remove("show");
}

// Hide overlay when clicking on ESC
document.addEventListener('keydown', function (e) {
    if(e.keyCode==27) {
        hideOverlay();
    }
});

// Fetching api url and authorization headers
const getImages=(apiUrl) => {
    fetch(apiUrl, {
        headers: {Authorization: APIKey},
    }).then(
        (result) => {
            let data=result.json();
            return data;
        }
    ).then((data) => {
        generateImageDom(data.photos);
    }).catch((rej) => alert(`Falied To Load Resourses ${rej}`));
};


const downloadingImage=function (imgUrl) {
    fetch(imgUrl).then(reselt => {
        // Convert Image url to blob 
        let theimgeState=reselt.blob();
        // console.log(theimgeState);
        return theimgeState;
    }).then((theimgeState) => {
        // console.log(theimgeState);
        // Create the links That Take image url
        let thelink=document.createElement("a");
        // Pass the image url to the link
        thelink.href=URL.createObjectURL(theimgeState);
        // The Name That Image Download By It
        if(searchval==null) {
            searchval="image";
            thelink.download=`${searchval} ${new Date().getTime()}`;
        } else {
            thelink.download=`${searchval} ${new Date().getTime()}`;
        }
        // Excute the download when clicking
        thelink.click();
    }).catch((rej) => alert("Falide To Download Image"));
};
// Fuction loaded More inages
const loadMoreImages=function () {
    currentPage++;
    let apiUrl=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${numberOfImagePerPage}`;
    // Check if the input search has value or not and if it has value the function will take search url if not the function will take the normal url
    apiUrl=searchval? `https://api.pexels.com/v1/search?query=${searchval}&page=${currentPage}&per_page=${numberOfImagePerPage}`:apiUrl;
    console.log(searchval);
    getImages(apiUrl);
};

// Function search for image by name
theInput.addEventListener('keyup', function (e) {
    if(e.target.value===" ") {
        return searchval=null;

    }
    if(e.key==='Enter') {
        currentPage=1;
        searchval=e.target.value;
        theCardContainer.innerHTML="";
        getImages(`https://api.pexels.com/v1/search?query=${searchval}&page=${currentPage}&per_page=${numberOfImagePerPage}`);
    }
});

// Close the overlay from anyWhere no condition the close btn

document.addEventListener('click', function (e) {
    if(e.target==theOverlay) {
        hideOverlay();
    }
});



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${numberOfImagePerPage}`);

loadMore.addEventListener('click', loadMoreImages);


