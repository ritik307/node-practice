const deleteProduct = (btn)=>{
    const prodId = btn.parentNode.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.parentNode.querySelector('[name=_csrf]').value;
    //? closest is used to find the closest parent element from that perticular(aka button) element
    const productElement = btn.closest('article');


    //? fetch is also used for sending data 
    fetch("/admin/product/"+prodId,{
        method:"DELETE",
        headers:{
            "csrf-token":csrf
        },
    }).then(result=>{
        console.log("PRODUCT DESTROYED SUCCESSFULLY");
        return result.json();
    })
    .then(data=>{
        console.log(data);
        productElement.remove();
    })
    .catch(err=>{
        console.log("ERROR WHILE DELETING PRODUCT");
    })
}