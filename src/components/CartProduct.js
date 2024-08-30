
  
import { Currentcart } from "./Currentcart";

export const CartProduct = ({ cartProducts ,CartIncrease,CartDecrease}) => {
    console.log('Rendering CartProduct with:', cartProducts); 
    return cartProducts.map((product) => (
        <Currentcart key={product.ID} cartProducts={product}
        CartIncrease={CartIncrease}
        CartDecrease={CartDecrease}
        
        />

    ));
};
