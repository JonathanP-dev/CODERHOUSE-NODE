import fs from 'fs'
import ProductManager from '../ProductManager/ProductManager.js';

const productManager = new ProductManager();

export default class CartManager {
  #carts;
  #id;
  #path;
  constructor() {
    this.#carts = []
    this.#id = 0
    this.#path = './carts.json'
  }

  async #setId () {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const carts = JSON.parse( contain )
      this.#id = `${Date.now()}-${carts.length}`
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        this.#id = `${Date.now()}-1`
      } else {
        console.log( `Error code: ${error}` )
      }
    }
    return this.#id
  }

  async getCarts () {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const carts = JSON.parse( contain )
      return carts
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#carts;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }

  async getCartById ( id ) {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const carts = JSON.parse( contain )
      const found = carts.find( cart => cart.id == id )
      if ( !found ) {
        console.log( `Cart with ID: ${id} not found` )
        return false
      }
      return found
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#carts;
      } else {
        console.log( `Error code: ${error}` )
        return false
      }
    }
  }

  async addCart ( products ) {

    let newCart = {
      id: await this.#setId(),
      products: products
    }

    // antes de leer archivo chequeamos que efectivamente se haya ingresado algo en el post.
    // de esta forma ahorramos todos los pasos posteriores.
    if ( !products ) {
      console.log( `Invalid value` )
      return false
    }

    const IdQuantityCheck = products?.find( product => {
      return ( product?.quantity > 0 && product?.id?.length > 0 )
    } )
    if ( !IdQuantityCheck ) {
      console.log( `Quantity or ID error` )
      return false
    }
    try {
      // leemos si el archivo tiene algo, en caso de que tenga algo se lo asignamos a carritos
      const contain = await fs.promises.readFile( this.#path )
      // chequear el caso de que el archivo exista pero este vacio.
      const carts = JSON.parse( contain )
      if ( carts ) {
        this.#carts = carts
      }

      // recorro el arrary de productos que recibo por parametros y voy comprobando que en todos
      // se cumpla la condicion de que exista el id en el archivo de productos.
      // chequear forma de hacerlo con every/some u otro metodo de array.
      let isValid = true
      for ( let i = 0; i < products.length; i++ ) {
        let productInProducts = products[i];
        productInProducts = await productManager.getProductById( productInProducts.id )
        if ( !productInProducts ) {
          console.log( 'Error: producto no encontrado', productInProducts )
          isValid = false
        }
      }

      if ( isValid ) {
        // si llegamos aca, esta validado asi que lo pusheamos y escribimos el archivo
        this.#carts.push( newCart )
        await fs.promises.writeFile( this.#path, JSON.stringify( this.#carts ) )
        console.log( `Cart '${newCart.id}' added.-` )
        return true

      } else {
        console.log( 'isValid: ', isValid )
        return false
      }

    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {

        // si el codigo de error es ENOENT es porque el archivo no existe, si no existe, no tenemos datos.
        // si no tenemos datos lo creamos con un arreglo vacio y llamamos recursivamente a la funcion addCart.
        console.log( `ARCHIVO VACIO:` )
        await fs.promises.writeFile( this.#path, JSON.stringify( [] ) )
        await this.addCart( products )
        return true
      } else {
        console.log( `Error code: ${error}` )
        return false
      }
    }
  }

  async addProductToCart ( cid, pid ) {
    const carts = await this.getCarts()
    let newCarts = carts
    const cart = await this.getCartById( cid );
    let newCart = cart
    const productsInCart = cart.products;

    console.log( productsInCart )
    const product = await productManager.getProductById( pid );

    if ( !cart ) {
      console.log( `Cart id ${cid} not found` )
      return false
    }

    if ( !product ) {
      console.log( `Product id ${pid} not found` )
      return false
    }

    const quantityCheck = cart.products.find( item => item.id == pid )

    this.#carts = newCarts
    if ( !quantityCheck ) {
      carts.map( ( item, index ) => {
        if ( item.id == cid ) {
          newCarts.splice( index, 1, { id: cid, products: [...item.products, { id: pid, quantity: 1 }] } )
        }
        return newCarts
      } )
      this.#carts = newCarts
      console.log( `Product with id: ${product.title} (${pid}) added to cart ${cid}` )
      fs.promises.writeFile( this.#path, JSON.stringify( this.#carts ) )
      console.log( 'newCart', newCart.products )
      console.log( 'newCarts', newCarts )
      return true
    } else {
      cart.products.map( ( item, index ) => {
        if ( item.id == pid ) {
          productsInCart.splice( index, 1, { ...item, quantity: item.quantity + 1 } )
        }
        return productsInCart
      } )
      newCart = { id: cid, products: productsInCart }
      carts.map( ( item, index ) => {
        if ( item.id == cid ) {
          newCarts.splice( index, 1, newCart )
        }
        return newCarts
      } )
      this.#carts = newCarts
      fs.promises.writeFile( this.#path, JSON.stringify( this.#carts ) )
      console.log( 'el producto ya existe en el carrito de agrego una unidad mas' )
      console.log( 'newCart', newCart.products )
      console.log( 'newCarts', newCarts )
      return true
    }
  }
}
