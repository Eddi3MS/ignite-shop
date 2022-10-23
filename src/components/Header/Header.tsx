import Image from 'next/future/image'
import Link from 'next/link'
import React from 'react'
import { HeaderContainer } from './styles'

import logoImg from '../../assets/svgs/logo.svg'
import { useRouter } from 'next/router'
import Cart from '../Cart'

const Header = () => {
  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'

  return (
    <HeaderContainer>
      <Link href='/'>
        <Image src={logoImg} alt='ignite shop' />
      </Link>

      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}

export default Header
