function popup(id,title,description,specialization){
    document.getElementById(id).style.display='block';
    document.getElementById('projtitlemodal').innerHTML=title + " | " + specialization;
    document.getElementById('projcontentmodal').innerHTML=description;
}