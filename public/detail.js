function addToCart1(){
  console.log("hello");
    // const productId = document.getElementById("product-id").value;
    // const quantity = document.getElementById('quantity').value;
    const image = document.getElementById('p-i').src; // Correct way to get the image URL
    const author = document.getElementById('p-a').textContent; // Correct way to get text content
    const price = document.getElementById('p-p').textContent.trim(); // Get price as text
    const title = document.getElementById('p-t').textContent; // Get text content directly
    // const category=document.getElementById('c_id');
    
  
  console.log(author,image,title);
     fetch("/add-to-cart",{
         method:'post',
         headers:{ 'Content-Type': 'application/json'},
         body:JSON.stringify({
        
            title:title,
            author:author,
            price:price,
            image:image,
            // category:category
  
         })
     })
  
     .then(response => response.json())
     
     .then(data => {
         if (data.success) {
             // showSnackbar('Added ' + quantity + ' item(s) to the cart', 'success');
             console.log("add in cart")
             alert("prduct added to cart");
         } else {
             // showSnackbar('Error adding to cart: ' + data.message, 'error');
             console.log("for add to cart ocur error");
             alert("error occure");
         }
     })
     .catch(error => {
         console.error('Error:', error);
         // showSnackbar('Something went wrong!', 'error');
         
     });
  }
  
  