import { ComponentProps } from 'react'
import { ProductSkeletonContainer, SkeletonItem } from './styles'

type ProductSkeletonProps = ComponentProps<typeof ProductSkeletonContainer>

const ProductSkeleton = ({ ...props }: ProductSkeletonProps) => {
  return (
    <ProductSkeletonContainer {...props}>
      <SkeletonItem />
      <div>
        <SkeletonItem />
        <SkeletonItem />
      </div>
    </ProductSkeletonContainer>
  )
}

export default ProductSkeleton
