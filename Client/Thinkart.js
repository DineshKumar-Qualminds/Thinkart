const tableElement = document.getElementById('table-results');
let updatedPostId = '';

document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
});

function fetchPosts() {
  const postUrl = "https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products.json";

  fetch(postUrl, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
    .then((response) => response.json())
    .then((products) => {
      console.log(products);
      if(!products){
        console.log('Error fetching products: No data found');
        tableElement.innerHTML = `<tr><td colspan="6">No products found</td></tr>`;
        return; 
      }
  

      let tableRows = '';
      for (let post in products) {
        const productId = parseInt(post, 10) || post;
        let productName = products[post].name || 'Product Name Unavailable';
        let productData = products[post].data || 'Description Unavailable';
        let productImage = products[post].image || ''; 
        let productPrice = products[post].price || 'Price Unavailable';

        
        tableRows += `
          <tr>
            <td>${productId}</td>
            <td>${productName}</td>
            <td>${productData}</td>
            <td><img src="${productImage}" alt="${productName}"></td>
            <td>${productPrice}</td>
            <td>
              <div class="btn-container">
                <button class="edit-post">Edit</button>
                <button class="delete-post">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }
      tableElement.innerHTML = tableRows;



    const addCardBtn = document.querySelectorAll('.add-to-card');
    addCardBtn.forEach(button =>{
    button.addEventListener('click',(e) => {
    const productId = e.target.productId;
    // addItemToCard(productId);
    // updateCartDisplay();
    getProductById(productId)
  });
});
});
}


const addCardBtn = document.querySelectorAll('.add-to-card');
addCardBtn.forEach(button =>{
    button.addEventListener('click',(e) => {
    const productId = e.target.dataset.productId;
    addItemToCart(productId);
    updateCartDisplay();
  });
});



let addBtnElemenet = document.getElementById('addBtn');
addBtnElemenet.addEventListener('click', () => {
  let addProductElement = document.getElementById('add-product');
  addProductElement.style.display = 'block';
});

const closeElements = document.getElementsByClassName("close");

for (let closeElement of closeElements) {
  closeElement.addEventListener('click', (e) => {
    e.preventDefault();
    closeModelDialog();
  });
}

function closeModelDialog() {
  let addProduct = document.getElementById('add-product');
  addProduct.style.display = 'none';
  document.getElementById('update-model').style.display = 'none';
}

const addProduct = document.getElementById('add-product');

addProduct.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const data = document.getElementById('description').value;
  const image = document.getElementById("image").value;
  const price = document.getElementById('price').value;

  fetch("https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products.json", {
    method: 'POST',
    body: JSON.stringify({
      name,
      data,
      image,
      price
    }),
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
    .then((response) => response.json())
    .then(() => {
      fetchPosts();
      closeModelDialog();
      e.target.reset();
    })
    .then((json) => console.log(json));
});


tableElement.addEventListener('click', (e) => {
  let target = e.target;

  if (target.classList.contains('edit-post')) {
    const postId = target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    updatedPostId = postId;
    document.getElementById('update-model').style.display = 'block';

    fetch(`https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products/${postId}.json`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`); // Handle error
        }
        return response.json();
      })
      .then((product) => {
        console.log(product);
        populateModelFields(product);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        // Display an error message to the user
      });
  }
});

let populateModelFields = (post) => {
  if (document.getElementById('updatedName')) {
    document.getElementById('updatedName').value = post.name;
  }
  if (document.getElementById('updatedDescription')) {
    document.getElementById('updatedDescription').value = post.data;
  }
  if (document.getElementById('updatedImage')) {
    document.getElementById('updatedImage').value = post.image;
  }
  if (document.getElementById('updatedPrice')) {
    document.getElementById('updatedPrice').value = post.price;
  }
};




// Update form
const updateModel = document.querySelector('#update-model form');
updateModel.addEventListener('submit', (e) => {
  e.preventDefault();
  let name = document.getElementById('updatedName').value;
  let data = document.getElementById('updatedDescription').value;
  let image = document.getElementById('updatedImage').value;
  let price = document.getElementById('updatedPrice').value;

  fetch(`https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products/${updatedPostId}.json`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      data,
      image,
      price
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      console.log(response);
      fetchPosts();
      closeModelDialog();
    })
    .then((json) => console.log(json));
});

// Deleting The Post
tableElement.addEventListener('click', (e) => {
  let target = e.target;
  if (target.classList.contains('delete-post')) {
    let postId = target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products/${postId}.json`, {
        method: 'DELETE',
      })
        .then((response) => {
          console.log(response);
          fetchPosts();
        });
    }
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  renderCart(cartContainer, cart);

  const addCartBtns = document.querySelectorAll('.add-to-cart');
  addCartBtns.forEach(button => {
      button.addEventListener('click', (e) => {
          const productId = e.target.dataset.productId;
          const product = getProductById(productId);
          if (product) {
              cart.push(product);
              localStorage.setItem('cart', JSON.stringify(cart));
              renderCart(cartContainer, cart);
          }
      });
  });
});



