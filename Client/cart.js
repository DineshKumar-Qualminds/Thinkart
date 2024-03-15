let cartContainerElement = document.getElementById('cartContainer');
let toggleBtnElement = document.getElementById('toggleBtn');
let cartItems = [];
let allProducts = []

document.addEventListener('DOMContentLoaded', () => {
    getProductById();
});

function getProductById(productId) {
    const postUrl = "https://thinkart-932fb-default-rtdb.asia-southeast1.firebasedatabase.app/products.json";

    fetch(postUrl)
        .then(response => response.json())
        .then(products => {
            console.log(products);
            if (!products) {
                console.log('Error fetching products: No data found');
                cartContainerElement.innerHTML = `<tr><td colspan="6">No products found</td></tr>`;
                return;
            }

            for (let post in products) {
                const productId = parseInt(post, 10) || post;
                let productName = products[post].name || 'Product Name Unavailable';
                let productData = products[post].data || 'Description Unavailable';
                let productImage = products[post].image || '';
                let productPrice = products[post].price || 'Price Unavailable';
                let product = { id: productId, name: productName, description: productData, image: productImage, price: productPrice };
                renderCard(product);
                allProducts.push(product);
            }   
        });
}

function renderCard(product) {
    const card = createCard(product);
    cartContainerElement.appendChild(card);
}



document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchInput = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput)
    );
                
    renderFilteredProducts(filteredProducts);
});

            
function renderFilteredProducts(products) {
cartContainerElement.innerHTML = '';
products.forEach(product => {
renderCard(product);
});
}


function createCard(product) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundColor = '#f0ff8c';

    
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    card.appendChild(image);

    const name = document.createElement('h2');
    name.textContent = product.name;
    name.classList.add('item-name')
    card.appendChild(name);

    const description = document.createElement('p');
    description.textContent = product.description;
    description.classList.add("description");
    description.setAttribute('id','descriptionId')
    card.appendChild(description);

    const readMore = document.createElement('a');
    // readMore.setAttribute('href',"readMore")
    readMore.textContent = "Readmore";
    readMore.setAttribute('id',"readMore");
    readMore.addEventListener('click', function() {
        if(description.length>200){
            description.style.display = "block"
        }else{
            if (description.style.display === 'none') {
                description.style.display = 'block';
                description.style.paddingBottom="120px";
                readMore.textContent = "Read less";
            } else {
                description.style.display = 'none';
                readMore.textContent = "Read more";
            }

        }
       
    });
    card.appendChild(readMore);
    
  
    description.style.display = 'none';


    const price = document.createElement('p');
    price.textContent = product.price;
    price.classList.add("price");
    card.appendChild(price);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');

    let btn = document.createElement('button');
    btn.textContent="Add Cart"
    buttonContainer.appendChild(btn);
    card.appendChild(buttonContainer);

    let detailsBtn = document.createElement("button");
    detailsBtn.textContent = "Details";
    buttonContainer.appendChild(detailsBtn);
    card.appendChild(buttonContainer);


    btn.addEventListener('click',() => {
        addToCart(product);
        updateCartQuantity();
    });
    // console.log(card)
    return card;
    
}




function addToCart(product) {
    cartItems.push(product);
    updateCartQuantity();
}

function updateCartQuantity(event) {
    let quantityDisplay = document.getElementById('cartBtn');
    quantityDisplay.textContent = cartItems.length;
    
}


function renderCart() {

    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add("close-btn");
    closeBtn.textContent = 'Close';


    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    
    });
    modalContent.appendChild(closeBtn);

    const table = document.createElement('table');
    table.classList.add('cart-table');

    const headerRow = document.createElement('tr');
    const headers = ['Image', 'Product Name', 'Price', 'Quantity', 'Total', 'Actions'];
    headerRow.style.backgroundColor = "#ff704d";

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        header.style.padding = "10px"
        header.style.fontSize = "20px";
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    let total = 0;
    const itemMap = new Map();
    cartItems.forEach(item => {
        if (!itemMap.has(item.id)) {
            itemMap.set(item.id, { ...item, quantity: 1 });
        } 
        else {
            itemMap.get(item.id).quantity++;
        }
    });

    itemMap.forEach(item => {
        const row = document.createElement('tr');

        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.style.maxWidth= '150px';
        image.style.maxHeight = '150px'
        image.style.margin = '10px';

        imageCell.appendChild(image);
        row.appendChild(imageCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.padding = "10px";
        nameCell.style.fontSize = "22px";
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        const numaricalPrice = parseFloat(item.price.replace('₹', ''));
        priceCell.textContent = numaricalPrice;
        priceCell.style.fontSize = "22px";
        // console.log(numaricalPrice);
        row.appendChild(priceCell);

       
    
        const quantityCell = document.createElement('td');
        const quantityInput = document.createElement('input');
        
        quantityInput.setAttribute('id',"quantityInput");
        quantityInput.style.fontSize = "22px";
        quantityInput.type = 'number';
        quantityInput.value = item.quantity; 
        quantityInput.min = '1';
        // quantityInput.addEventListener("change",(event) => {
        //     let quantityDisplay = document.getElementById('cartBtn');
        //     quantityDisplay.textContent = `${event.target.value}`;

        // })

        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        
          //update price
          quantityInput.addEventListener('change', (event) => {
          const newQuantity = parseInt(event.target.value);
            item.quantity = newQuantity;
            totalCell.textContent= (numaricalPrice * newQuantity).toFixed(2);
            //update new prices
            console.log(typeof(parseInt(totalCell.textContent)))
            console.log((parseInt(totalCell.textContent)))
            var totalAmount = parseInt(totalCell.textContent)
            console.log(totalAmount);
            updateCartTotal();
            });
      



        var totalCell = document.createElement('td');
        var itemTotal = parseFloat(numaricalPrice) * parseFloat(item.quantity);
        console.log(itemTotal);
        total+=itemTotal;
        console.log(total)
        console.log(itemTotal);
        totalCell.textContent = itemTotal.toFixed(2);
        totalCell.style.fontSize = "22px";
        row.appendChild(totalCell);

  
        const actionsCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
            let quantityDisplay = document.getElementById('cartBtn');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            quantityDisplay.textContent= currentQuantity-1;
            renderCart();
           
        });
        actionsCell.appendChild(removeBtn);
        row.appendChild(actionsCell);
        table.appendChild(row);
    });
  

    var totalRow = document.createElement('tr');
    var totalCell = document.createElement('td');
    totalCell.colSpan = 5;
    totalCell.textContent = 'Total';
    totalCell.style.fontSize="25px";
    totalCell.style.textAlign="center"
    totalRow.appendChild(totalCell);
    const totalAmountCell = document.createElement('td');

   
    console.log(total);
    totalAmountCell.textContent = total.toFixed();
    totalAmountCell.style.fontSize="25px";
    totalAmountCell.style.textAlign="center";
    totalAmountCell.style.background="yellowgreen"


    function updateCartTotal() {
        total = 0; // Reset total before updating
        itemMap.forEach(item => {
            total += parseFloat(item.price.replace('₹', '')) * item.quantity; 
        });
        totalAmountCell.textContent = total.toFixed(2);
    }
    
    totalRow.appendChild(totalAmountCell);
    totalRow.style.background="greenyellow"
    table.appendChild(totalRow);


    modalContent.appendChild(table);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const buyBtnElement = document.createElement("button");
    buyBtnElement.classList.add("buyBtn");
    buyBtnElement.textContent="Buy"
    modal.appendChild(buyBtnElement);

    
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#d2f5fc';
    modal.style.padding = '20px';
    modal.style.maxWidth = '80%';
    modal.style.maxHeight = '100%';
    modal.style.overflow = 'auto';
}



document.getElementById('cartIconLink').addEventListener('click', () => {
    renderCart();
});



document.addEventListener('DOMContentLoaded', () => {
    updateCartQuantity();
});
document.getElementById('addBtn').addEventListener('click', () => {
    addToCart({});
});





