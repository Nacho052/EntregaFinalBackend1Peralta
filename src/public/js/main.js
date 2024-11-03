const socket = io();

socket.on("products", (data) => {
  productsRender(data);
});

const productsRender = (products) => {
  const productsContainer = document.getElementById("productsContainer");

  productsContainer.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div class"d-flex flex-row ">
        <div class="card border-warning bg-secondary" style="width: 18rem;">
            <img src=${item.thumbnails} class="card-img-top" alt="...">
            <div class="card-body ">
                <h1> ${item.title}</h1>
                <p> ${item._id}</p>
                <p> ${item.description}</p>
                <p> ${item.code}</p>
                <p> ${item.price}</p>
                <p> ${item.stock}</p>
                <p> ${item.category}</p>
                <button class="delete-btn" data-id="${item._id}"> delete </button>
                <br></br> 
            </div>
        </div>
      </div>
    `;
    productsContainer.appendChild(card);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      deleteProduct(productId);
    });
  });
};

const deleteProduct = (productId) => {
  socket.emit("deleteProduct", productId);
};


const form = document.getElementById("product-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const productTitle = document.getElementById("product-title").value;
  const productDescription = document.getElementById("product-description").value;
  const productCode = document.getElementById("product-code").value;
  const productPrice = parseFloat(document.getElementById("product-price").value);
  const productStock = parseInt(document.getElementById("product-stock").value);
  const productCategory = document.getElementById("product-category").value;
  const productThumbnails = document.getElementById("product-thumbnails").value || "No contiene imagen";

  const AddNewProducts = {
    title: productTitle,
    description: productDescription,
    code: productCode,
    price: productPrice,
    stock: productStock,
    category: productCategory,
    thumbnails: productThumbnails
  };

  socket.emit("addProduct", AddNewProducts);
  form.reset();
});

socket.on("products", (data) => {
    productsRender(data);
  });