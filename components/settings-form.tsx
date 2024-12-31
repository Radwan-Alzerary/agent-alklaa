"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface CompanySettings {
  name: string
  logo: string
  details: string
  phoneNumber: string
  address: string
}

export function SettingsForm() {
  const router = useRouter()
  const [settings, setSettings] = useState<CompanySettings>({
    name: "",
    logo: "",
    details: "",
    phoneNumber: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Here you would typically send the settings to your backend
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تحديث معلومات الشركة",
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ معلومات الشركة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم الشركة</Label>
        <Input
          id="name"
          name="name"
          value={settings.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="logo">شعار الشركة</Label>
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {settings.logo && (
          <div className="mt-2">
            <Image
              src={settings.logo}
              alt="Company Logo"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="details">تفاصيل الشركة</Label>
        <Textarea
          id="details"
          name="details"
          value={settings.details}
          onChange={handleChange}
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">رقم الهاتف</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={settings.phoneNumber}
          onChange={handleChange}
          type="tel"
        />
      </div>
      <div>
        <Label htmlFor="address">عنوان الشركة</Label>
        <Textarea
          id="address"
          name="address"
          value={settings.address}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </Button>
    </form>
  )
}

