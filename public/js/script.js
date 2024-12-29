function toggleMenu() {
  const menu = document.getElementById('navbarMain');
  menu.classList.toggle('show');
}

window.addEventListener('resize', function () {
  const menu = document.getElementById('navbarMain');
  if (window.innerWidth > 991) {
    menu.classList.add('show');
  } else {
    menu.classList.remove('show');
  }
});

document.addEventListener('click', function (event) {
  const menu = document.getElementById('navbarMain');
  const toggleButton = document.getElementById('toggleButton');
  if (menu.classList.contains('show') && 
      !menu.contains(event.target) && 
      !toggleButton.contains(event.target)) {
    menu.classList.remove('show');
  }
});

function increaseValue() {
  let quantity = document.getElementById('quantity');
  let value = parseInt(quantity.value, 10);
  value = isNaN(value) ? 1 : value;
  value++;
  quantity.value = value;
}

function decreaseValue() {
  let quantity = document.getElementById('quantity');
  let value = parseInt(quantity.value, 10);
  value = isNaN(value) ? 1 : value;
  if (value > 1) {
      value--;
  }
  quantity.value = value;
}

let checkDelivery = async () => {
  const pincode = document.querySelector('input[name="pincode"]').value;
  const url = `https://api.postalpincode.in/pincode/${pincode}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    if (data[0].PostOffice) {
      const postOfficeNames = data[0].PostOffice.map(post => post.Name);
      showSnackbar("Delivery is available on this pincode.", 'success');
      return true;
    } else {
      showSnackbar("Delivery not available on this pincode.", 'error');
      return false;
    }
  } catch (error) {
    showSnackbar("Please Enter a Valid Pincode.", 'error');
    return false;
  }
}

function buyNow() {
  checkDelivery().then(isAvailable => {
    if (isAvailable) {
      window.location.href = "/buy-now";
    } else {
      showSnackbar('Please Check Pincode.', 'error');
    }
  });
}

function login() {
  window.location.href = "/login";
}

function addToCart() {
 
      const productId = document.getElementById("product-id").value;
      const quantity = document.getElementById('quantity').value;
      const image = document.getElementById('pro-img').src;
      const author = document.getElementById('pro-author').textContent;
      const price = document.getElementById('pro-price').textContent.trim();
      const title = document.getElementById('pro-title').textContent;
      const category = document.getElementById('cat_id').textContent;

      fetch("/add-to-cart", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
          title: title,
          author: author,
          price: price,
          image: image,
          category: category,
        })
      }).then((res) => {
        return res.json();
      }).then((data) => {
        showSnackbar('Item added to cart.', 'success');
        updatecartCount();
      }).catch((err) => {
        showSnackbar('Item added to cart.', 'success');
      });
    
     
    
}

function AddToCart(modalId) {
  const activeModal = document.querySelector(`#${modalId}`);

  if (!activeModal) {
      showSnackbar('Error: Modal not found.', 'error');
      return;
  }

  const modelProductId = activeModal.querySelector("[name='productId']");
  const modelImage = activeModal.querySelector('.modal-image');
  const modelAuthor = activeModal.querySelector('.modal-author');
  const modelPrice = activeModal.querySelector('.modal-price');
  const modalTitleElement = activeModal.querySelector('.modal-title');
  const category = activeModal.querySelector('.modal-card-category').textContent;

  const productId = modelProductId ? modelProductId.value : "Product ID not found";
  const title = modalTitleElement ? modalTitleElement.textContent : "Title not found";
  const author = modelAuthor ? modelAuthor.textContent : "Author not found";
  const price = modelPrice ? modelPrice.textContent : "Price not found";
  const image = modelImage ? modelImage.src : "Image not found";

  fetch("/add-to-cart", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          productId: productId,
          title: title,
          author: author,
          price: price,
          image: image,
          category: category,
          quantity: 1,
      })
  })
      .then((res) => res.json())
      .then((data) => {
          showSnackbar('Item added to cart.', 'success');
          updatecartCount();
          add_to_cart_message();
      })
      .catch((err) => {
          showSnackbar('Error adding to cart.', 'error');
      });
}

function addToCart2() {
  AddToCart('detailModal');
}

function addToCart3() {
  AddToCart('detailModal1');
}

function addToCart4() {
  AddToCart('detailModal2');
}

function addToCart5() {
  AddToCart('detailModal3');
}

function addToCart6() {
  AddToCart('detailModal4');
}

function addToCart7() {
  AddToCart('detailModal5');
}

function addToCart8() {
  AddToCart('detailModal6');
}

function add_to_cart_message() {
  window.location.href = "/add_to_cart_message";
}

function showSnackbar(message, type) {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show " + type;
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
