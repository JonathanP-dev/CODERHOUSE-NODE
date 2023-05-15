import { Router } from 'express';
import CartManager from '../CartManager/CartManager.js';

const cartRouter = Router()

const cartManager = new CartManager();

cartRouter.get( '/', async ( req, res ) => {
  let { limit } = req.query
  const contain = await cartManager.getCarts()
  let carts = []
  if ( limit ) {
    for ( let i = 0; i < limit; i++ ) {
      const element = contain[i];
      if ( !element ) break
      carts.push( element )
    }
  } else {
    carts = contain
  }

  res.send( { carts } )
} )

cartRouter.get( '/:cid', async ( req, res ) => {
  let id = req.params.cid
  let response = await cartManager.getCartById( id )
  console.log( response )
  let cart = response?.id ? response : res.status( 404 ).send( { status: "error", msg: "Cart not found" } )

  res.send( { cart } )
} )

cartRouter.post( '/', async ( req, res ) => {
  const cart = req.body
  let response = await cartManager.addCart( cart )
  console.log( response )
  if ( !response ) {
    res.status( 400 ).send( { status: 'Error', msg: 'Error trying to add cart' } )
  }
  res.send( { status: 'Success', msg: `Cart added` } )
} )

cartRouter.post( '/:cid/product/:pid', async ( req, res ) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let response = await cartManager.addProductToCart( cid, pid )
  console.log( response )
  if ( !response ) {
    res.status( 400 ).send( { status: 'Error', msg: 'Error trying to add cart' } )
  }
  res.send( { status: 'Success', msg: `Cart added` } )
} )

export default cartRouter;