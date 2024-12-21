// Scroll Setup Function
function setupScroll(divId, prevBtnId, nextBtnId, repeatCount) {
  const bookRow = document.getElementById(divId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  // Function to duplicate cards multiple times
  function duplicateCards(repeatCount) {
    const originalCards = Array.from(bookRow.children); // Get all original cards
    for (let i = 0; i < repeatCount; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true); // Clone the card
        bookRow.appendChild(clone); // Add the cloned card to the end
      });
    }
  }

  // Duplicate cards initially
  duplicateCards(repeatCount);

  // Function to scroll left
  function scrollLeft() {
    const scrollAmount = 250; // Adjust the scroll amount
    if (bookRow.scrollLeft <= 0) {
      // Jump to the duplicated section
      bookRow.scrollLeft += bookRow.scrollWidth / 2;
    }
    bookRow.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  // Function to scroll right
  function scrollRight() {
    const scrollAmount = 250; // Adjust the scroll amount
    if (bookRow.scrollLeft + bookRow.clientWidth >= bookRow.scrollWidth) {
      // Jump back to the start
      bookRow.scrollLeft -= bookRow.scrollWidth / 2;
    }
    bookRow.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  // Disable vertical scrolling on bookRow
  bookRow.addEventListener('wheel', (event) => {
    if (event.deltaX !== 0) {
      // Prevent vertical scrolling
      event.preventDefault();
    }
  }, { passive: false }); // Ensure preventDefault works

  // Attach events to buttons
  prevBtn.addEventListener('click', scrollLeft);
  nextBtn.addEventListener('click', scrollRight);
}

// Setup both scrollable divs
setupScroll('bookRow', 'prevBtn', 'nextBtn', 5);  
setupScroll('bookRow1', 'prevBtn1', 'nextBtn1', 5); 
setupScroll('bookRow2', 'prevBtn2', 'nextBtn2', 5); 
setupScroll('bookRow3', 'prevBtn3', 'nextBtn3', 5); 
setupScroll('bookRow4', 'prevBtn4', 'nextBtn4', 5); 
setupScroll('bookRow5', 'prevBtn5', 'nextBtn5', 5); 
setupScroll('bookRow6', 'prevBtn6', 'nextBtn6', 5); 

// Modal Setup Function
document.addEventListener("DOMContentLoaded", () => {
  const setupModal = (rowId, modalId) => {
    const bookRow = document.getElementById(rowId);
    const modal = document.getElementById(modalId);
    const modalImage = modal.querySelector(".modal-image");
    const modalTitle = modal.querySelector(".modal-title");
    const modalAuthor = modal.querySelector(".modal-author");
    const modalDescription = modal.querySelector(".modal-description");
    const modelPrice = modal.querySelector(".modal-price");
    const wishlistForm = modal.querySelector(".wishlist-form");
    const wishlistInput = wishlistForm.querySelector("input[name='productId']");
    const closeBtn = modal.querySelector(".close-btn");

    // `bookRow` वर क्लिक इव्हेंट लावा
    bookRow.addEventListener("click", (e) => {
      const card = e.target.closest(".custom-card");
      if (!card) return;

      // कार्डमधील डेटा मिळवा
      const bookImage = card.querySelector(".custom-card-img").src;
      const bookTitle = card.querySelector(".card-title").textContent;
      const bookAuthor = card.querySelector("h6").textContent;
      const bookDescription =
        card.querySelector(".desc").textContent || "माहिती उपलब्ध नाही.";
      const bookPrice =
        card.querySelector(".getprice").textContent || "किंमत उपलब्ध नाही";
      const productId = card
        .querySelector(".getprice")
        .getAttribute("data-id");

      // मॉडलकडे डेटा पाठवा
      modalImage.src = bookImage;
      modalTitle.textContent = bookTitle;
      modalAuthor.textContent = bookAuthor;
      modalDescription.textContent = bookDescription;
      modelPrice.textContent = bookPrice;
      wishlistInput.value = productId;

      // मॉडल दाखवा
      modal.style.display = "flex";
    });

    // क्लोज बटणावर इव्हेंट लावा
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // मॉडलकडे बाहेर क्लिक केल्यावर मॉडल बंद करा
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  };

 
  setupModal("bookRow", "detailModal");
  setupModal("bookRow1", "detailModal1");
  setupModal("bookRow2", "detailModal2");
  setupModal("bookRow3", "detailModal3");
  setupModal("bookRow4", "detailModal4");
  setupModal("bookRow5", "detailModal5");
  setupModal("bookRow6", "detailModal6");
});

// Heart Button Toggle Function
const heartButtons = document.querySelectorAll('.heartBtn');
        
heartButtons.forEach((heartBtn) => {
  heartBtn.addEventListener('click', function(event) {
    const heartIcon = this.querySelector('.heartIcon'); // Get the icon inside the clicked button

    // Toggle between regular (outline) and solid heart
    if (heartIcon.classList.contains('fa-regular')) {
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
    } else {
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
    }
  });
});

// Update Wishlist Count Function
async function updateWishlistCount() {
  try {
      const response = await fetch('/api/wishlist-count');
      const data = await response.json();
      const wishlistCount = data.wishlistCount;
    
      const wishlistBadge = document.getElementById('wishlist-count');
      
      if (wishlistCount > 0) {
          wishlistBadge.textContent = wishlistCount;
          wishlistBadge.style.display = 'inline-block';
      } else {
          wishlistBadge.style.display = 'none';
      }

    
  } catch (error) {
      console.error('Error fetching wishlist count:', error);
  }
}

document.addEventListener("DOMContentLoaded", updateWishlistCount);

// Update Cart Count Function
async function updatecartCount() {
  try {
      const response = await fetch('/api/cart-count');
      const data = await response.json();
      const cartCount = data.cartCount;
    
      const cartBadge = document.getElementById('cart-count');
      
      if (cartCount > 0) {
          cartBadge.textContent = cartCount;
          cartBadge.style.display = 'inline-block';
      } else {
          cartBadge.style.display = 'none';
      }

    
  } catch (error) {
      console.error('Error fetching cart count:', error);
  }
}

document.addEventListener("DOMContentLoaded", updatecartCount);

// Toggle Navbar Menu Function
function toggleMenu() {
  const menu = document.getElementById('navbarMain');
  menu.classList.toggle('show');
}
      
// Prevent Bootstrap's default behavior of auto-expanding the navbar on resize
window.addEventListener('resize', function () {
  const menu = document.getElementById('navbarMain');
  if (window.innerWidth > 991) {
    menu.classList.add('show');
  } else {
    menu.classList.remove('show');
  }
});
      
// Close the menu if clicked outside
document.addEventListener('click', function (event) {
  const menu = document.getElementById('navbarMain');
  const toggleButton = document.getElementById('toggleButton'); // Replace with your button's ID

  // Check if the click is outside the menu and the toggle button
  if (menu.classList.contains('show') && 
      !menu.contains(event.target) && 
      !toggleButton.contains(event.target)) {
    menu.classList.remove('show'); // Close the menu
  }
});

// Quantity Increment/Decrement Functions
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

// Check Delivery Availability Function
function checkDelivery() {
  let pincode = document.querySelector('input[name="pincode"]').value;
  if (pincode === "") {
      showSnackbar("Please enter a pincode.", 'warning');
      return;
  }

  // Mock check for pincode delivery
  if (pincode > "0") {
      showSnackbar("Delivery available.", 'success');
  } else {
      showSnackbar("Sorry, delivery is not available at this location.", 'error');
  }
}

// Buy Now Function
function buyNow() {
  const pincode = document.querySelector('input[name="pincode"]').value;
   // Check if pincode is entered
   if (!pincode) {
    showSnackbar('Please enter your pincode to check delivery.', 'error');
    return;
}

  window.location.href = "/buy-now"; // Redirect to the buy-now page
}

// Login Function
function login(){
  window.location.href = "/login";
}

// Add to Cart Function
function addToCart(){
  const pincode = document.querySelector('input[name="pincode"]').value;
   // Check if pincode is entered
   if (!pincode) {
    showSnackbar('Please enter your pincode to check delivery.', 'error');
    return;
}

  const productId = document.getElementById("product-id").value;
  const quantity = document.getElementById('quantity').value;
  const image = document.getElementById('pro-img').src; // Correct way to get the image URL
  const author = document.getElementById('pro-author').textContent; // Correct way to get text content
  const price = document.getElementById('pro-price').textContent.trim(); // Get price as text
  const title = document.getElementById('pro-title').textContent; // Get text content directly
  const category=document.getElementById('cat_id').textContent;

  console.log(productId,quantity,author,image,title);
   fetch("/add-to-cart",{
       method:'post',
       headers:{ 'Content-Type': 'application/json'},
       body:JSON.stringify({
           productId:productId,
           quantity:quantity,
          title:title,
          author:author,
          price:price,
          image:image,
          category:category,
      })
  }).then((res)=>{
      return res.json();
  }).then((data)=>{
     showSnackbar('Item added to cart.', 'success');
     updatecartCount();
  }).catch((err)=>{
     showSnackbar('Error adding item to cart.', 'error');
  });
}

// Show Snackbar Function
function showSnackbar(message, type) {
  const snackbar = document.getElementById("snackbar");
  snackbar.className = "show " + type;
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
