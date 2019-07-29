let btn=document.querySelector('#sub');
btn.onclick=function(){
  let data=$('form').serialize();
//   console.log(data);
$.ajax({
    url:'http://127.0.0.1:8888/views/add.html/setuser',
    data,
    success:function(hh){
        console.log(hh);
        console.log(hh.msg);
        if (hh.code==200){
            alert(hh.msg)
        }
    } 
})



}