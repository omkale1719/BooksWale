// Scroll Setup Function
function setupScroll(divId, prevBtnId, nextBtnId, repeatCount) {
  const bookRow = document.getElementById(divId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  function duplicateCards(repeatCount) {
      const originalCards = Array.from(bookRow.children);
      for (let i = 0; i < repeatCount; i++) {
          originalCards.forEach(card => {
              const clone = card.cloneNode(true);
              bookRow.appendChild(clone);
          });
      }
  }

  duplicateCards(repeatCount);

  function scrollLeft() {
      const scrollAmount = 400;
      if (bookRow.scrollLeft <= 0) {
          bookRow.scrollLeft += bookRow.scrollWidth / 2;
      }
      bookRow.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
      });
  }

  function scrollRight() {
      const scrollAmount = 400;
      if (bookRow.scrollLeft + bookRow.clientWidth >= bookRow.scrollWidth) {
          bookRow.scrollLeft -= bookRow.scrollWidth / 2;
      }
      bookRow.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
      });
  }

  bookRow.addEventListener('wheel', (event) => {
      if (event.deltaX !== 0) {
          event.preventDefault();
      }
  }, { passive: false });

  prevBtn.addEventListener('click', scrollLeft);
  nextBtn.addEventListener('click', scrollRight);
}

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
      

      bookRow.addEventListener("click", (e) => {
          const card = e.target.closest(".custom-card");
          if (!card) return;

          const bookImage = card.querySelector(".custom-card-img").src;
          const bookTitle = card.querySelector(".card-title").textContent;
          const bookAuthor = card.querySelector("h6").textContent;
          const bookDescription = card.querySelector(".desc").textContent || "माहिती उपलब्ध नाही.";
          const bookPrice = card.querySelector(".getprice").textContent || "किंमत उपलब्ध नाही";
          const productId = card.querySelector(".getprice").getAttribute("data-id");

          modalImage.src = bookImage;
          modalTitle.textContent = bookTitle;
          modalAuthor.textContent = bookAuthor;
          modalDescription.textContent = bookDescription;
          modelPrice.textContent = bookPrice;
          wishlistInput.value = productId;

          modal.style.display = "flex";
      });

      closeBtn.addEventListener("click", () => {
          modal.style.display = "none";
      });

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
      const heartIcon = this.querySelector('.heartIcon');

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
