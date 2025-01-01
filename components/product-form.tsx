"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import JsBarcode from "jsbarcode"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { createProduct, updateProduct } from "@/lib/api"
import { Product } from "@/types"
import { API_URL } from '@/lib/apiUrl';

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [category, setCategory] = useState(product?.category || "")
  const [price, setPrice] = useState(product?.price.toString() || "")
  const [stock, setStock] = useState(product?.stock.toString() || "")
  const [status, setStatus] = useState(product?.status || "")
  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [imageUrl, setImageUrl] = useState(product?.image || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [barcode, setBarcode] = useState(product?.barcode || "")
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(product?.image || "")
  const barcodeRef = useRef<SVGSVGElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (barcode && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcode, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 40,
          displayValue: true,
        })
      } catch (err) {
        console.error("Error generating barcode:", err)
      }
    }
  }, [barcode])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageTypeChange = (value: "url" | "upload") => {
    setImageType(value)
    // Reset the other input type
    if (value === "url") {
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setPreviewUrl(imageUrl)
    } else {
      setImageUrl("")
      setPreviewUrl("")
    }
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setPreviewUrl(url)
  }

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return ""

    const formData = new FormData()
    formData.append("image", selectedFile)

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      throw new Error("Image upload failed")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let finalImageUrl = ""

      if (imageType === "upload" && selectedFile) {
        finalImageUrl = await uploadImage()
      } else if (imageType === "url") {
        finalImageUrl = imageUrl
      }

      if (!finalImageUrl) {
        throw new Error("Image URL is required")
      }

      const productData: Omit<Product, '_id'> = {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        status,
        image: finalImageUrl,
        barcode,
        description
      };

      if (product) {
        await updateProduct(product._id as string, productData);
      } else {
        await createProduct(productData);
      }
      
      alert(product ? "تم تحديث المنتج بنجاح" : "تمت إضافة المنتج بنجاح")
      router.push("/products")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("حدث خطأ أثناء حفظ بيانات المنتج")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم المنتج</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">الفئة</Label>
        <Select onValueChange={setCategory} defaultValue={category}>
          <SelectTrigger>
            <SelectValue placeholder="اختر فئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
            <SelectItem value="ملابس">ملابس</SelectItem>
            <SelectItem value="أثاث">أثاث</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="price">السعر</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="stock">المخزون</Label>
        <Input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">الحالة</Label>
        <Select onValueChange={setStatus} defaultValue={status}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="متوفر">متوفر</SelectItem>
            <SelectItem value="غير متوفر">غير متوفر</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <Label>صورة المنتج</Label>
        <RadioGroup
          value={imageType}
          onValueChange={(value: "url" | "upload") => handleImageTypeChange(value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url">رابط صورة</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload">رفع صورة</Label>
          </div>
        </RadioGroup>

        {imageType === "url" ? (
          <Input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="أدخل رابط الصورة"
            required={imageType === "url"}
          />
        ) : (
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={imageType === "upload"}
          />
        )}

        {previewUrl && (
          <div className="mt-4">
            <Label>معاينة الصورة</Label>
            <div className="mt-2 border rounded-md overflow-hidden">
              <img
                src={previewUrl}
                alt="Product preview"
                className="max-w-xs h-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="barcode">الباركود</Label>
        <Input
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
        <div className="mt-4">
          <Label>معاينة الباركود</Label>
          <svg ref={barcodeRef} />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : (product ? "تحديث المنتج" : "إضافة المنتج")}
      </Button>
    </form>
  )
}