let productos = [];

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    cargarProductos(data);
  });

const cargarProductos = (data) => {
  productos = data;
  const contenedor = document.getElementById("products-container");
  productos.forEach((producto, indice) => {
    let card = document.createElement("div");
    card.classList.add("product__card");
    card.innerHTML = ` <div class="card">
        <h5 class="card-title">${producto.titulo}</h5>
        <img src=${producto.imagen} class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-text">
            ${producto.descripcion}
          </p>
          <h5 class="card__price">Precio: <span>${producto.precio}</span></h5>
          <a href="#" class="btn" onClick="agregarAlCarrito(${indice})">Añadir al Carrito</a>
        </div>
      </div>`;
    contenedor.appendChild(card);
  });
};

let cart = [];

const agregarAlCarrito = (indiceDelArrayProducto) => {
  const indiceEncontrado = cart.findIndex((elemento) => {
    return elemento.id === productos[indiceDelArrayProducto].id;
  });
  if (indiceEncontrado === -1) {
    let productoAgregar = productos[indiceDelArrayProducto];
    productoAgregar.cantidad = 1;
    cart.push(productoAgregar);
    dibujarCarrito();
  } else {
    cart[indiceEncontrado].cantidad += 1;
    actualizarStorage(cart);
    dibujarCarrito();
  }
};
let carritoContainer = document.getElementById("cart-container");
let total = 0;

const dibujarCarrito = () => {
  carritoContainer.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((producto, indice) => {
      total = total + producto.precio * producto.cantidad;
      let carrito = document.createElement("div");
      carrito.className = "producto-carrito";
      carrito.innerHTML = `
        <img class="car-img" src="${producto.imagen}"/>
        <div class="product-details">
          ${producto.titulo}
        </div>
        <div class="product-details" > Cantidad: ${producto.cantidad}</div>
        <div class="product-details"> Precio: $ ${producto.precio}</div>
        <div class="product-details"> Subtotal: $ ${
          producto.cantidad * producto.precio
        }</div>
        <button class="btn btn-info"  id="remove-product" onClick="removeProduct(${indice})">Eliminar producto</button>
         `;
      carritoContainer.appendChild(carrito);
    });
    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "total"> TOTAL $ ${total}</div>
  <button class= "btn btn-info finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    carritoContainer.appendChild(totalContainer);
  } else {
    carritoContainer.innerHTML = `<h3 class="carrito__titulo"> No hay productos seleccionados, diríjase a la seccion productos </h3>`;
  }
};

const removeProduct = (indice) => {
  cart.splice(indice, 1);
  actualizarStorage(cart);
  dibujarCarrito();
};

const actualizarStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
}

const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  carritoContainer.innerHTML = "";
  const compraFinalizada = `<div class="compra-finalizada"><p class="compra-parrafo"> YA CASI ES TUYA LA COMPRA, EL   ${total} </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
  <button class= "btn  formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
  </div>`;
  carritoContainer.innerHTML = compraFinalizada;
};

const dibujarFormu = () => {
  carritoContainer.innerHTML = "";
  const formulario = `
  <h2> DATOS PARA EL ENVÍO </h2>
  <div class="contact__secction-container container-fluid">
   <div class="row">
     <div class="contact__secction__item">
       <label>Nombre</label>
       <input type="text" id="nombre" placeholder="Nombre"  />
     </div>
     <div class="contact__secction__item">
       <label>E-mail</label>
       <input type="text" id="mail" placeholder="E-mail" />
     </div>
     <div class="contact__secction__item">
       <label>Telefono</label>
       <input type="text" id="telefono" placeholder="Telefono"  />
     </div>
     <div class="contact__secction__item">
       <label>Domicilio</label>
       <input type="text" id="domicilio" placeholder="Domicilio" />
     </div>
     <div class="contact-button">
       <button type="button" class="btn btn-danger envio" onClick="mostrarMensaje()" >Confirmar</button>
     </div>
   </div>
 </div>`;
  carritoContainer.innerHTML = formulario;
};

const mostrarMensaje = () => {
  const nombreCliente = document.getElementById("nombre").value;
  const domicilioCliente = document.getElementById("domicilio").value;
  carritoContainer.innerHTML = "";
  let mensaje = `<div class="mensaje-final"> MUCHAS GRACIAS POR SU COMPRA!! </div>`;
  carritoContainer.innerHTML = mensaje;
  Swal.fire({
    position: "center",
    icon: "success",
    title: `Gracias ${nombreCliente} por comprar en Roticeria Franchu! en breve recibira su pedido en ${domicilioCliente}`,
    showConfirmButton: true,
    allowOutsideClick: false,
  });
};
