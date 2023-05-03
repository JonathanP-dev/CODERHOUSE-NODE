import fs from 'fs'

export default class ProductManager {
  #products;
  #id;
  #path;
  constructor() {
    this.#products = []
    this.#id = 0;
    this.#path = './products.json'
  }

  async #setId () {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      this.#id = products.length + 1
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        this.#id = 1;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
    return this.#id
  }

  async addProduct ( product ) {
    let newProduct = {
      id: await this.#setId(),
      code: product.code,
      title: product.title,
      description: product.desc,
      price: product.price,
      thumbnail: product.thumb,
      stock: product.stock
    }
    // verificamos que el producto a agregar tenga todos los valores. 
    // Lo hacemos al inicio porque si no cuenta con un valor no tiene sentido leer el archivo.
    if ( !product.title || !product.code || !product.desc || !product.price || !product.thumb || !product.stock ) return console.log( `Invalid value.` )

    try {
      // leemos si el archivo tiene algo, en caso de que tenga algo se lo asignamos a products
      const contain = await fs.promises.readFile( this.#path )
      // chequear el caso de que el archivo exista pero este vacio.
      const products = JSON.parse( contain )
      if ( products ) {
        this.#products = products
      }

      // si el arreglo no esta vacio entonces buscamos si existe coincidencia en el code del producto.
      // Si existe coincidencia damos mensaje de error, sino agregamos el producto.
      const found = products.find( product => product.code == newProduct.code )
      if ( found ) {
        console.log( `ERROR. Code ${newProduct.code} for product '${newProduct.title}' is already used in product '${product.title}'.` )
      } else {
        this.#products.push( newProduct )
        await fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
        return console.log( `Product '${newProduct.title}' added.-` )
      }
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {

        // si el codigo de error es ENOENT es porque el archivo no existe, si no existe, no tenemos datos.
        // si no tenemos datos lo creamos con ese producto ingresado.
        this.#products.push( newProduct )
        await fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
        console.log( `Product '${newProduct.title}' added.` )
        return true
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }

  async getProducts () {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      return products
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#products;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }

  async getProductById ( id ) {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      const found = products.find( product => product.id == id )
      if ( !found ) return `Product with ID: ${id} not found`
      return found
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#products;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }

  async updateProduct ( id, product ) {
    if ( !product.title || !product.code || !product.desc || !product.price || !product.thumb || !product.stock ) return `Invalid value.`
    try {

      // En este caso para validar el codigo me aseguro que el title tambien sea el mismo.
      // Si el code se repite pero con el mismo nombre te deja modificar los datos, sino no
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      this.#products = products
      // controlo que exista el producto con el id pasado
      const found = products.find( exists => exists.id == id )
      if ( !found ) return `Product with ID: ${id} not found`

      // controlo que si el code se repite tenga el mismo title
      const titleError = products.find( item => item.code == product.code )
      if ( titleError ) {
        if ( titleError.title !== product.title ) {
          console.log( titleError )
          return `ERROR. Code ${product.code} for product '${product.title}' is already used in product '${titleError.title}'.`
        }
        return titleError
      }

      const newProducts = this.#products
      products.map( ( item, index ) => {
        if ( item.id == id ) {
          newProducts.splice( index, 1, { id: id, ...product } )
        }
        return newProducts
      } )
      this.#products = newProducts
      fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
      console.log( `Product with ID ${id} modified.` )
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return `No cuenta con productos para modificar`;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }

  async deleteProduct ( id ) {
    try {
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      const found = products.find( product => product.id == id )
      if ( !found ) return `Product with ID: ${id} not found`

      products.map( ( item, index ) => {
        if ( item.id == id ) {
          products.splice( index, 1 )
          fs.promises.writeFile( this.#path, JSON.stringify( products ) )
          console.log( `Product with ID ${id} deleted.` )
          this.#products = products
          // chequear return aca.. undefined 
          // return `Product with ID ${id} deleted.`
        }
      } )
      return found
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#products;
      } else {
        console.log( `Error code: ${error}` )
      }
    }
  }
}

// TEST CODE
// const manager = new ProductManager()

// const product1 = {
//   code: 710,
//   title: 'prod1',
//   desc: 'cocoa vascolet',
//   price: 100,
//   thumb: 'Sin imagen',
//   stock: 10
// }
// const product2 = {
//   code: 720,
//   title: 'prod2',
//   desc: 'cafe negro',
//   price: 120,
//   thumb: 'Sin imagen',
//   stock: 5
// }
// const product3 = {
//   code: 730,
//   title: 'prod3',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product4 = {
//   code: 740,
//   title: 'prod4',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product5 = {
//   code: 750,
//   title: 'prod5',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product6 = {
//   code: 760,
//   title: 'prod6',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product7 = {
//   code: 770,
//   title: 'prod7',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product8 = {
//   code: 780,
//   title: 'prod8',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product9 = {
//   code: 790,
//   title: 'prod9',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }
// const product10 = {
//   code: 800,
//   title: 'prod10',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }


// await manager.addProduct( product1 )
// await manager.addProduct( product2 )
// await manager.addProduct( product3 )
// await manager.addProduct( product4 )
// await manager.addProduct( product5 )
// await manager.addProduct( product6 )
// await manager.addProduct( product7 )
// await manager.addProduct( product8 )
// await manager.addProduct( product9 )
// await manager.addProduct( product10 )
// console.log( await manager.getProducts() )


// *** UPDATE PRODUCT ***
// const product40 = {
//   code: 1144,
//   title: 'prod4',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// const product50 = {
//   code: 7448,
//   title: 'prod5',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// const product60 = {
//   code: 7440,
//   title: 'prod6',
//   desc: 'otro cafe',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// console.log( await manager.updateProduct( 1, product40 ) )
// console.log( await manager.updateProduct( 2, product50 ) )
// console.log( await manager.updateProduct( 5, product5 ) )
// console.log( await manager.updateProduct( 2, product6 ) )