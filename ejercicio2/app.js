import fs from 'fs'

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

  async addProduct ( product ) {
    let newProduct = {
      id: this.#setId(),
      code: product.code,
      title: product.title,
      description: product.desc,
      price: product.price,
      thumbnail: product.thumb,
      stock: product.stock
    }
    if ( !product.title || !product.code || !product.desc || !product.price || !product.thumb || !product.stock ) return console.log( `Invalid value.` )
    if ( this.#products.length == 0 ) {
      this.#products.push( newProduct )
      await fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
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
      await fs.promises.writeFile( this.#path, JSON.stringify( this.#products ) )
      return console.log( `Product '${newProduct.title}' added.-` )
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
    try {
      if ( !product.title || !product.code || !product.desc || !product.price || !product.thumb || !product.stock ) return `Invalid value.`

      // En este caso para validar el codigo me aseguro que el title tambien sea el mismo.
      // Si el code se repite pero con el mismo nombre te deja modificar los datos, sino no
      const contain = await fs.promises.readFile( this.#path )
      const products = JSON.parse( contain )
      let isValid = true;
      for ( let i = 0; i < products.length; i++ ) {
        const item = products[i];
        if ( item.code == product.code ) {
          if ( item.title !== product.title ) {
            isValid = false;
            console.log( `ERROR. Code ${product.code} for product '${product.title}' is already used in product '${item.title}'.` )
          }
        }
      }
      if ( isValid ) {
        isValid = false
        const found = products.map( ( item, index ) => {
          if ( item.id == id ) {
            isValid = true
            products.splice( index, 1, product )
            fs.promises.writeFile( this.#path, JSON.stringify( products ) )
            this.#products = products
            console.log( `Product with ID ${id} modified.` )
            // return found
            // chequear return aca.. undefined 
            // return `Product with ID ${id} modified.`
          }
        } )
        if ( !isValid ) return `Product with ID: ${id} not found`
        // if ( !found ) return `Product with ID: ${id} not found`
      }
    } catch ( error ) {
      if ( error.code == 'ENOENT' ) {
        return this.#products;
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

const manager = new ProductManager()

// console.log( await manager.getProducts() )

const product1 = {
  code: 714,
  title: 'prod1',
  desc: 'cocoa vascolet',
  price: 100,
  thumb: 'Sin imagen',
  stock: 10
}

const product2 = {
  code: 744,
  title: 'prod2',
  desc: 'cafe negro',
  price: 120,
  thumb: 'Sin imagen',
  stock: 5
}

const product3 = {
  code: 7144,
  title: 'prod3',
  desc: 'te ingles',
  price: 900,
  thumb: 'Sin imagen',
  stock: 15
}

// *** ADD PRODUCT ***
// await manager.addProduct( product1 )
// await manager.addProduct( product2 )
// await manager.addProduct( product3 )
// console.log( await manager.getProducts() )



// *** GET BY ID ***
// console.log( await manager.getProductById( 2 ) )
// console.log( await manager.getProductById( 8 ) )



// *** UPDATE PRODUCT ***
// const product4 = {
//   code: 1144,
//   title: 'prod4',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// const product5 = {
//   code: 7448,
//   title: 'prod5',
//   desc: 'te ingles',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// const product6 = {
//   code: 7440,
//   title: 'prod6',
//   desc: 'otro cafe',
//   price: 900,
//   thumb: 'Sin imagen',
//   stock: 15
// }

// console.log( await manager.updateProduct( 1, product4 ) )
// console.log( await manager.updateProduct( 2, product5 ) )
// console.log( await manager.updateProduct( 5, product5 ) )
// console.log( await manager.updateProduct( 2, product6 ) )

// await manager.addProduct( product4 )
// await manager.addProduct( product5 )

// *** DELETE PRODUCT ***
// console.log( await manager.deleteProduct( 1 ) )
// console.log( await manager.deleteProduct( 4 ) )

// *** comprobando id correlativo. ***
// await manager.addProduct( product6 )
// console.log( await manager.deleteProduct( 2 ) )