"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CatalogFiltersProps {
  categories: string[]
  categoryLabels: Record<string, string>
}

export default function CatalogFilters({ categories, categoryLabels }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger>
        <SelectValue placeholder="Все категории" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все категории</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {categoryLabels[category] || category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
