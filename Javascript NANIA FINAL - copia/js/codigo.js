
const URL_POST = "https://jsonplaceholder.typicode.com/posts";

const producto = [
    { id: 1, Titulo: "CHOCOTORTA", Precio: 350 },
    { id: 2, Titulo: "TARTA FRUTAL ", Precio: 500 },
    { id: 3, Titulo: "TORTA ROGEL", Precio: 600 },
    { id: 4, Titulo: "LEMON PIE", Precio: 650 },
    { id: 5, Titulo: "CHEESCAKE ARANDANOS", Precio: 450 },
    { id: 6, Titulo: "TARTA TOFI", Precio: 800 },
    { id:7, Titulo: "TORTA DE RICOTA", Precio:500 },
    { id:8, Titulo: "FIDEOS CON BOLOGNESA", Precio:480 },
    { id:9, Titulo: "PASTEL DE PAPA", Precio:500 },
    { id:10, Titulo: "HAMBURGUESA CON PURE", Precio:520 },
    { id:11, Titulo: "BURRITOS CON PAPAS", Precio:480 },
];
const productoJSON = JSON.stringify(producto);

localStorage.setItem("productoJSON", productoJSON);
localStorage.setItem("producto", producto);
console.log(localStorage.getItem("producto"));

const productoDesdeLocalStorage = localStorage.getItem("productoJSON");
console.log(productoDesdeLocalStorage);

const productoParse = JSON.parse(productoDesdeLocalStorage);
console.log(productoParse);

 
// ARRANCANDO CON ARRAYS
class Producto {
  constructor(nombre, precio) {
      this.nombre = nombre;
      this.precio = parseFloat(precio);
      this.vendido = false;
  }
  sumaIva() {
      this.precio = this.precio * 1.21;
  }
}

// ajax y json
/*ESTE PRODUCTO LO ARME PARA INSTANCIAR EL JSON Y QUE COINCIDAN LOS PARÁMETROS QUE RECIBE*/
class ProductoII {
  constructor(id, img, titulo, precio) {
      this.id = id;
      this.img = img;
      this.titulo = titulo;
      this.precio = precio;
  }
  sumaIva() {
      this.precio = this.precio * 1.21;
  }
}

let displayComidaJSON;
//ESTE ARRAY ES EL QUE RECIBE LA INFO DE AJAX
/*FUNCION PARA INSTANCIAR EL JSON A UN OBJETO Y PODER APLICAR METODOS*/
const InstancioDataComida = (arraycomidaResponse) => {
  displayComidaJSON = arraycomidaResponse.map((item) => new ProductoII(
      item.id,
      item.img,
      item.titulo,
      item.precio
  ));
  creandoProductos(displayComidaJSON);

}
// json
// defino la url de mi API de datos
const urlProductos = 'js/productos.json';
//hago el llamado a mi API para traer los datos 
$.get(urlProductos, (response, success) => {
  if (success === "success") {
      // funcion que muestra todas las variedades
      console.log('respuesta', response)
      InstancioDataComida(response);
      
      const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
      addToShoppingCartButtons.forEach((addToCartButton) => {
          addToCartButton.addEventListener('click', addToCartClicked);
      });
  }
});


// funcion para agregar al html

function creandoProductos(comida) {
    const productContainer = document.querySelector('.main-container');
    productContainer.innerHTML = '';
    comida.forEach(item => {
        productContainer.innerHTML +=
            `<section class="col-12 col-md-6 col-xl-4 ">
    
                
                    <div class="item shadow mb-4 cardcolor">
                        <h3 class="title cardcolor">${item.titulo}</h3>
                        <img class="item-image" src="${item.img}">
                        <div class="item-details">
                            <h4 class="price">$ ${item.precio}</h4>
                            <button onclick="myFunction()" class="item-button btn btn-primary addToCart" id="okBoton">AÑADIR AL CARRITO</button>
                        </div>
                    </div>
                
        
  </section>`;
    });
 
}



//FUNCION ALERTA DE AÑADIR AL CARRITO

function myFunction() {
    Swal.fire(
        'Nuevo producto agregado al carrito',
        '',
        'success'
      )
}



// CARRITO DE COMPRAS

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

function addToCartClicked(event) {

     const button = event.target;

     const item = button.closest('.item');

    const itemTitle = item.querySelector('.title').textContent;
    const itemPrice = item.querySelector('.price').textContent;
    const itemImage = item.querySelector('.item-image').src;

            addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}



function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
      'shoppingCartItemTitle'
  );

  for (let i = 0; i < elementsTitle.length; i++) {
      if (elementsTitle[i].innerText === itemTitle) {
          let elementQuantity = elementsTitle[
              i
          ].parentElement.parentElement.parentElement.querySelector(
              '.shoppingCartItemQuantity'
          );
          elementQuantity.value++;
          $('.toast').toast('show');
          updateShoppingCartTotal();
          return;
      }
  }



  const shoppingCartRow = document.createElement('div');

  const shoppingCartContent =
   `
<div class="row shoppingCartItem cardcolor">
      <div class="col-6">
          <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
              <img src=${itemImage} class="shopping-cart-image">
              <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate titlecarrito ml-3 mb-0">${itemTitle}</h6>
          </div>
      </div>
      <div class="col-2">
          <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
              <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
          </div>
      </div>
      <div class="col-4">
          <div
              class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
              <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                  value="1">
              <button class="btn btn-danger buttonDelete" type="button">X</button>
          </div>
      </div>
  </div>`;


  shoppingCartRow.innerHTML = shoppingCartContent;

  shoppingCartItemsContainer.append(shoppingCartRow);


  shoppingCartRow
      .querySelector('.buttonDelete')
      .addEventListener('click', removeShoppingCartItem);


  shoppingCartRow
      .querySelector('.shoppingCartItemQuantity')
      .addEventListener('change', quantityChanged);

  updateShoppingCartTotal();
}


function updateShoppingCartTotal() {
  let total = 0;
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
      const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
          '.shoppingCartItemPrice'
      );
      const shoppingCartItemPrice = Number(
          shoppingCartItemPriceElement.textContent.replace('$', '')
      );
      const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
          '.shoppingCartItemQuantity'
      );
      const shoppingCartItemQuantity = Number(
          shoppingCartItemQuantityElement.value
      );
      total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

//ELIMINAR PRODUCTO DEL CARRITO
function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.closest('.shoppingCartItem').remove();
  updateShoppingCartTotal();
}

// CAMBIAR LA CANTIDAD PRODUCTO
function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  updateShoppingCartTotal();
}

//BOTON DE COMPRAR
function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = '';
  updateShoppingCartTotal();
}

// FORMULARIO DE EMAIL

$("#form").on("submit", (e) => {
      e.preventDefault();
      const payload = { email: $("#email").val() };
      $.post(URL_POST, payload, (respuesta, estado) => {
          console.log(respuesta);
          console.log(estado);
          if (estado === "success") Swal.fire(
            'LISTO',
            'Ya tenemos tu mail pronto nos pondremos en contacto',
            'success'
          )
      })
  })
  // storage

 


  