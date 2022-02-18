const dropZone = document.querySelector('.drop-zone');
let fileInput = document.querySelector('#file');
const browse = document.querySelector('#browse');
const progressBar = document.querySelector('.progressBar');
const progressContainer = document.querySelector('.progress-container');
const percentage = document.querySelector('#percentage');
const link = document.querySelector('.link');
const LinkContainer = document.querySelector('.Link-container');
const toast = document.querySelector('#toast');
const copy = document.querySelector('#copy');
const maxAllowedFileSize = 100 * 1024 * 1024;
let timer;
const Toast= function(msg){
    if(timer>0){
        clearTimeout(timer);
    }
    toast.innerText = msg;
    toast.style.transform = "translateX(0%)";
    timer = setTimeout(() => {
        toast.style.transform = "translateX(-100%)";
      }, 2000);
}

browse.addEventListener('click',()=>{
    fileInput.click();
});
dropZone.addEventListener("dragover", function(event) {
    event.preventDefault();
    dropZone.classList.add('dragged');
});
dropZone.addEventListener("dragleave", function(event) {
    event.preventDefault();
    dropZone.classList.remove('dragged');
});
dropZone.addEventListener("drop", function(event) {
    event.preventDefault();
    dropZone.classList.remove('dragged');
    let files  = event.dataTransfer.files;
    if(files[0].size < maxAllowedFileSize){
        fileInput.files = files;
        upload();
    }else{
        Toast('Allowed Max file size is 100MB');
    }
    
});
fileInput.addEventListener('change',(event)=>{
    let files = event.target.files;
    if(files[0].size < maxAllowedFileSize){
        fileInput.files = files;
        upload();
    }else{
        Toast('Allowed Max file size is 100MB');
    }
});
const progressEvent = (e)=>{
    progressContainer.style.display = "block";
    progressBar.style.width = `${Math.round((e.loaded/e.total)*100)}%`;
    percentage.innerText = `${Math.round((e.loaded/e.total)*100)}%`;
}
const upload = function(){
    //console.log(fileInput.files[0]);
    const formdata = new FormData();
    formdata.append("myfile",fileInput.files[0]);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
        progressEvent(event);
    }
    xhr.open("POST","https://share-file-app.herokuapp.com/api/files",true);
    xhr.send(formdata);
    fileInput.value = "";
    //console.log(fileInput.files[0]);
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === xhr.DONE){
            LinkContainer.style.display = "block";
            var data=xhr.responseText;
            var jsonResponse = JSON.parse(data);
            link.value = jsonResponse["url"];
        }
    }
    
}
copy.addEventListener('click',()=>{
    let linkdata = link.value;
    link.select();
    navigator.clipboard.writeText(linkdata);
    Toast('copy to clipboard');
});
