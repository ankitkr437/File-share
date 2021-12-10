const dropZone =document.querySelector(".dashed-container");
const inputfile =document.querySelector("#fileinput")
const button =document.querySelector(".browsebtn")

const bgprogress = document.querySelector(".bg-progress");
const percentcontainer = document.querySelector(".percent-container");
const progressbar= document.querySelector(".progress-bar");

const progresscontainer= document.querySelector(".progress-container");
let inputurl= document.querySelector(".inputurl");
 
const downloadablelink = document.querySelector(".downloadable-link");
const copysvg = document.querySelector(".copy-svg");

let emailForm  = document.querySelector("#emailForm");
let receiver  = document.querySelector("#receiver");
let  sender = document.querySelector("#sender");
let EmailContainer  = document.querySelector(".Email-container");
let host ="https://innshare.herokuapp.com"
 
let uploadurl= host +"/api/files";
let emailURL =  host+"/api/files/send";

copysvg.addEventListener("click",()=>{
    //inputurl.select() is only for selection with this no one can copy or paste
       inputurl.select();
       //because for copy the url and so that anyone can paste it we use document.execCommand("copy")
       document.execCommand("copy")
})
dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains("dragged"))
    {
        dropZone.classList.add("dragged");  
        // dropZone.style.backgroundColor="red";
    } 
})

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged"); 
})

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    const files=e.dataTransfer.files;
    console.log(files)
    if(files.length)
    {
        inputfile.files=files  // similar to inputfile.value=name;
        uploadfile();
    }
    
    dropZone.classList.remove("dragged");  
})

button.addEventListener("click",()=>{
     inputfile.click()
})

inputfile.addEventListener("change",()=>{
    uploadfile()
})

const uploadfile =()=>{
    const file=inputfile.files[0]
    const formData = new FormData;
    formData.append("myfile",file)
    progresscontainer.style.display="block";
    const xhr= new XMLHttpRequest();
    xhr.onreadystatechange= () =>{
        if(xhr.readyState===XMLHttpRequest.DONE)
        {
            console.log(xhr.response);
            //since xhr.response is a json object so we have to convert it into javascript object
            copyLink(JSON.parse(xhr.response));
        }
          
    };
    xhr.upload.onprogress = updateProgress;
    xhr.open("POST",uploadurl)
    xhr.send(formData)
}


const updateProgress =(e)=>{

    const percent = Math.round((e.loaded/e.total *100));
    bgprogress.style.width=`${percent}%`
    percentcontainer.innerText=percent+"%";
    progressbar.style.transform=`scaleX(${percent/100})`
    //console.log(percent);
}

let copyLink=({file:url})=>{
  console.log(url)
  progresscontainer.style.display="none"
  inputurl.value=url;
  downloadablelink.style.display="block"
};

emailForm .addEventListener("submit",(e)=>{
    e.preventDefault();
   let url= inputurl.value ;
   
  let formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  }
  //console.log(formData);
//   async function test(){
//       try{
//           return(
//           await  fetch("https://innshare.herokuapp.com/api/files/send", {
//             method: "POST",
//             headers: { 
//                 "Content-Type":"application/json"
//             },
//             body: JSON.stringify(formData)
//           }) )
//       }
//       catch(error){
//           console.log(error);
//       }
//   }
   fetch(emailURL, {
    method: "POST",
    headers: { 
        'Content-Type':'application/json'
    },
    body: JSON.stringify(formData)
  })
   .then( (res ) => {
        res.json()
    }).then((data)=>{
        console.log(data);
    })
    
})