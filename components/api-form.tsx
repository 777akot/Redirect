"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Endpoint {
  path: string
  method: string
  description: string
}

export default function ApiForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ path: "", method: "GET", description: "" }])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_url: "",
    auth_type: "none",
    category: "",
    price_per_request: "0.001",
    rate_limit: "1000",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          endpoints: endpoints.filter((ep) => ep.path && ep.method),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create API")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating API:", error)
      alert("Ошибка при создании API. Попробуйте еще раз.")
    } finally {
      setLoading(false)
    }
  }

  const addEndpoint = () => {
    setEndpoints([...endpoints, { path: "", method: "GET", description: "" }])
  }

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index))
  }

  const updateEndpoint = (index: number, field: keyof Endpoint, value: string) => {
    const updated = [...endpoints]
    updated[index] = { ...updated[index], [field]: value }
    setEndpoints(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>Базовые настройки вашего API сервиса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название API</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Weather API"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание функционала API"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_url">Базовый URL</Label>
              <Input
                id="base_url"
                value={formData.base_url}
                onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                placeholder="https://api.example.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weather">Погода</SelectItem>
                    <SelectItem value="finance">Финансы</SelectItem>
                    <SelectItem value="social">Социальные сети</SelectItem>
                    <SelectItem value="ai">Искусственный интеллект</SelectItem>
                    <SelectItem value="data">Данные</SelectItem>
                    <SelectItem value="communication">Коммуникации</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth_type">Тип аутентификации</Label>
                <Select
                  value={formData.auth_type}
                  onValueChange={(value) => setFormData({ ...formData, auth_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без аутентификации</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_request">Цена за запрос ($)</Label>
                <Input
                  id="price_per_request"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={formData.price_per_request}
                  onChange={(e) => setFormData({ ...formData, price_per_request: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate_limit">Лимит запросов в час</Label>
                <Input
                  id="rate_limit"
                  type="number"
                  min="1"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Эндпоинты</CardTitle>
            <CardDescription>Определите доступные методы и пути вашего API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Путь</Label>
                  <Input
                    value={endpoint.path}
                    onChange={(e) => updateEndpoint(index, "path", e.target.value)}
                    placeholder="/weather"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Метод</Label>
                  <Select value={endpoint.method} onValueChange={(value) => updateEndpoint(index, "method", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Описание</Label>
                  <Input
                    value={endpoint.description}
                    onChange={(e) => updateEndpoint(index, "description", e.target.value)}
                    placeholder="Получить данные о погоде"
                  />
                </div>
                {endpoints.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeEndpoint(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEndpoint}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить эндпоинт
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Создание..." : "Создать API"}
          </Button>
        </div>
      </form>
    </div>
  )
}
