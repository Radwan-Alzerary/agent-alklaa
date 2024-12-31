"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginNotifications: false,
    passwordExpiryDays: 90,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the settings to your backend
    // For now, we'll just show a success message
    toast({
      title: "تم حفظ إعدادات الأمان بنجاح",
      description: "تم تحديث إعدادات الأمان للنظام",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={settings.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={settings.newPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={settings.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="twoFactorAuth"
          checked={settings.twoFactorAuth}
          onCheckedChange={() => handleSwitchChange("twoFactorAuth")}
        />
        <Label htmlFor="twoFactorAuth">تفعيل المصادقة الثنائية</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="loginNotifications"
          checked={settings.loginNotifications}
          onCheckedChange={() => handleSwitchChange("loginNotifications")}
        />
        <Label htmlFor="loginNotifications">تفعيل إشعارات تسجيل الدخول</Label>
      </div>
      <div>
        <Label htmlFor="passwordExpiryDays">عدد أيام انتهاء صلاحية كلمة المرور</Label>
        <Input
          id="passwordExpiryDays"
          name="passwordExpiryDays"
          type="number"
          value={settings.passwordExpiryDays}
          onChange={handleChange}
          min={1}
          max={365}
        />
      </div>
      <Button type="submit">حفظ إعدادات الأمان</Button>
    </form>
  )
}

