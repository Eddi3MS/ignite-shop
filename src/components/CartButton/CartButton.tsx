import { Handbag } from 'phosphor-react'
import { ComponentProps } from 'react'
import { CartButtonContainer } from './styles'

interface ICartButton extends ComponentProps<typeof CartButtonContainer> {
  quantity?: number
}

const CartButton = ({ quantity, ...rest }: ICartButton) => {
  return (
    <CartButtonContainer {...rest}>
      {quantity > 0 && <span>{quantity}</span>}
      <Handbag weight='bold' />
    </CartButtonContainer>
  )
}

export default CartButton
