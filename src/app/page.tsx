import { ProductList } from '@/components/features/products/ProductList/ProductList'
import { SearchBar } from '@/components/features/products/SearchBar/SearchBar'
import { CategorySelector } from '@/components/features/products/CategorySelector/CategorySelector'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar />
        <CategorySelector />
      </div>
      <ProductList />
    </div>
  )
}
