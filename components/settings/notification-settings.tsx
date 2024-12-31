"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newOrderNotifications: true,
    lowStockNotifications: true,
    paymentNotifications: true,
    systemUpdates: false,
  })

  const handleSwitchChange = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the settings to your backend
    // For now, we'll just show a success message
    toast({
      title: "تم حفظ إعدادات الإشعارات بنجاح",
      description: "تم تحديث إعدادات الإشعارات للنظام",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="emailNotifications"
          checked={settings.emailNotifications}
          onCheckedChange={() => handleSwitchChange("emailNotifications")}
        />
        <Label htmlFor="emailNotifications">تفعيل الإشعارات عبر البريد الإلكتروني</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="smsNotifications"
          checked={settings.smsNotifications}
          onCheckedChange={() => handleSwitchChange("smsNotifications")}
        />
        <Label htmlFor="smsNotifications">تفعيل الإشعارات عبر الرسائل النصية</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="pushNotifications"
          checked={settings.pushNotifications}
          onCheckedChange={() => handleSwitchChange("pushNotifications")}
        />
        <Label htmlFor="pushNotifications">تفعيل الإشعارات الفورية</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="newOrderNotifications"
          checked={settings.newOrderNotifications}
          onCheckedChange={() => handleSwitchChange("newOrderNotifications")}
        />
        <Label htmlFor="newOrderNotifications">إشعارات الطلبات الجديدة</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="lowStockNotifications"
          checked={settings.lowStockNotifications}
          onCheckedChange={() => handleSwitchChange("lowStockNotifications")}
        />
        <Label htmlFor="lowStockNotifications">إشعارات انخفاض المخزون</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="paymentNotifications"
          checked={settings.paymentNotifications}
          onCheckedChange={() => handleSwitchChange("paymentNotifications")}
        />
        <Label htmlFor="paymentNotifications">إشعارات المدفوعات</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="systemUpdates"
          checked={settings.systemUpdates}
          onCheckedChange={() => handleSwitchChange("systemUpdates")}
        />
        <Label htmlFor="systemUpdates">إشعارات تحديثات النظام</Label>
      </div>
      <Button type="submit">حفظ إعدادات الإشعارات</Button>
    </form>
  )
}

