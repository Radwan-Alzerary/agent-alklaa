"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    companyName: "",
    logo: "",
    details: "",
    phoneNumber: "",
    address: "",
    language: "ar",
    timezone: "Asia/Baghdad",
    dateFormat: "DD/MM/YYYY",
    currency: "IQD",
    enableDarkMode: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSelectChange = (name: string, value: string) => {
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
    // Here you would typically send the settings to your backend
    // For now, we'll just show a success message
    toast({
      title: "تم حفظ الإعدادات العامة بنجاح",
      description: "تم تحديث الإعدادات العامة للنظام",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="companyName">اسم الشركة</Label>
        <Input
          id="companyName"
          name="companyName"
          value={settings.companyName}
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
      <div>
        <Label htmlFor="language">اللغة</Label>
        <Select
          value={settings.language}
          onValueChange={(value) => handleSelectChange("language", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="timezone">المنطقة الزمنية</Label>
        <Select
          value={settings.timezone}
          onValueChange={(value) => handleSelectChange("timezone", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المنطقة الزمنية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asia/Baghdad">بغداد</SelectItem>
            <SelectItem value="Asia/Riyadh">الرياض</SelectItem>
            <SelectItem value="Asia/Dubai">دبي</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
        <Select
          value={settings.dateFormat}
          onValueChange={(value) => handleSelectChange("dateFormat", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر تنسيق التاريخ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="currency">العملة</Label>
        <Select
          value={settings.currency}
          onValueChange={(value) => handleSelectChange("currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر العملة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IQD">الدينار العراقي (IQD)</SelectItem>
            <SelectItem value="USD">الدولار الأمريكي (USD)</SelectItem>
            <SelectItem value="EUR">اليورو (EUR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableDarkMode"
          checked={settings.enableDarkMode}
          onCheckedChange={() => handleSwitchChange("enableDarkMode")}
        />
        <Label htmlFor="enableDarkMode">تفعيل الوضع الداكن</Label>
      </div>
      <Button type="submit">حفظ الإعدادات العامة</Button>
    </form>
  )
}

