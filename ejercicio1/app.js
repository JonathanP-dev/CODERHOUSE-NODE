const fs = require( 'fs' );

class ProductManager {
  #products;
  #id;
  #path;
  constructor() {
    this.#products = []
    this.#id = 0;
    this.#path = './products.json'
  }

  #setId () {
    this.#id++
    return this.#id
  }

  #addProductToFile () {
    const escribirArchivo = async () => {
      try {
        await fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
      } catch ( error ) {
        console.log( error )
      }
    }
    escribirArchivo()
  }

  // async #readProductsFromFile () {
  //   try {
  //     // chequear valor undefined
  //     const products = await fs.promises.readFile( this.#path, 'utf-8' )
  //     const readedProducts = JSON.parse( products )
  //     // return console.log( readedProducts )
  //     return readedProducts
  //     // chequear return readedProducts
  //   } catch ( error ) {
  //     console.log( error )
  //   }
  // }

  async #readProductByIdFromFile ( id ) {
    try {
      const products = await fs.promises.readFile( this.#path, 'utf-8' )
      const readedProducts = JSON.parse( products )
      const found = readedProducts.find( product => product.id == id )
      if ( !found ) return console.log( `Product with ID: ${id} not found` )
      console.log( found )

      // chequear return
      // return found
    } catch ( error ) {
      console.log( error )
    }
  }

  addProduct ( code, title, desc, price, thumb, stock ) {
    let newProduct = {
      id: this.#setId(),
      code,
      title,
      description: desc,
      price,
      thumbnail: thumb,
      stock
    }
    if ( !title || !code || !desc || !price || !thumb || !stock ) return console.log( `Invalid value.` )
    if ( this.#products.length == 0 ) {
      this.#products.push( newProduct )
      this.#addProductToFile()
      return console.log( `Product '${newProduct.title}' added.` )
    }

    // WITH LOOP FOR.
    let isValid = true;
    for ( let i = 0; i < this.#products.length; i++ ) {
      const product = this.#products[i];
      if ( product.code == newProduct.code ) {
        isValid = false;
        console.log( `ERROR. Code ${newProduct.code} for product '${newProduct.title}' is already used in product '${product.title}'.` )
        return isValid;
      }
    }
    if ( isValid ) {
      this.#products.push( newProduct )

      this.#addProductToFile()
      return console.log( `Product '${newProduct.title}' added.` )
    }
  }

  async getProducts () {
    // try {
    //   // chequear valor undefined
    //   const contain = await fs.promises.readFile( this.#path )
    //   const products = JSON.parse( contain )
    //   // return console.log( readedProducts )
    //   return products
    //   // chequear return readedProducts
    // } catch ( error ) {
    //   console.log( error )
    // }
    let contenido = await fs.promises.readFile( this.#path )
    let productos = JSON.parse( contenido )
    return productos
  }
  getProductById ( id ) {
    this.#readProductByIdFromFile( id )
  }
}

// TEST CODE

const productManager = new ProductManager
// console.log( productManager.getProducts() )
productManager.addProduct( 714, 'cocoa', 'cocoa vascolet', 100, 'Sin imagen', 10 )
// productManager.addProduct( 7146, 'cafe', 'vascolet', 10, 'Sin imagen', 10 )
// productManager.addProduct( 744, 'te', 'vascolet', 10, 'Sin imagen', 123 )
// productManager.addProduct( 714, 'leche', 'vascolet', 10, 'Sin imagen', 100 )
// productManager.addProduct( 7146, 'capuccino', 'vascolet', 10, 'Sin imagen', 100 )
let products = await productManager.getProducts()
console.log( products )

// console.log( productManager.getProductById( 1 ) )
