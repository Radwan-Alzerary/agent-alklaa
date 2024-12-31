"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function IntegrationSettings() {
  const [settings, setSettings] = useState({
    googleAnalyticsId: "",
    facebookPixelId: "",
    mailchimpApiKey: "",
    slackWebhookUrl: "",
    zapierWebhookUrl: "",
    enableGoogleAnalytics: false,
    enableFacebookPixel: false,
    enableMailchimp: false,
    enableSlack: false,
    enableZapier: false,
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
      title: "تم حفظ إعدادات التكاملات بنجاح",
      description: "تم تحديث إعدادات التكاملات للنظام",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="googleAnalyticsId">معرف Google Analytics</Label>
        <Input
          id="googleAnalyticsId"
          name="googleAnalyticsId"
          value={settings.googleAnalyticsId}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableGoogleAnalytics"
          checked={settings.enableGoogleAnalytics}
          onCheckedChange={() => handleSwitchChange("enableGoogleAnalytics")}
        />
        <Label htmlFor="enableGoogleAnalytics">تفعيل Google Analytics</Label>
      </div>
      <div>
        <Label htmlFor="facebookPixelId">معرف Facebook Pixel</Label>
        <Input
          id="facebookPixelId"
          name="facebookPixelId"
          value={settings.facebookPixelId}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableFacebookPixel"
          checked={settings.enableFacebookPixel}
          onCheckedChange={() => handleSwitchChange("enableFacebookPixel")}
        />
        <Label htmlFor="enableFacebookPixel">تفعيل Facebook Pixel</Label>
      </div>
      <div>
        <Label htmlFor="mailchimpApiKey">مفتاح API لـ Mailchimp</Label>
        <Input
          id="mailchimpApiKey"
          name="mailchimpApiKey"
          value={settings.mailchimpApiKey}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableMailchimp"
          checked={settings.enableMailchimp}
          onCheckedChange={() => handleSwitchChange("enableMailchimp")}
        />
        <Label htmlFor="enableMailchimp">تفعيل تكامل Mailchimp</Label>
      </div>
      <div>
        <Label htmlFor="slackWebhookUrl">رابط Webhook لـ Slack</Label>
        <Input
          id="slackWebhookUrl"
          name="slackWebhookUrl"
          value={settings.slackWebhookUrl}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableSlack"
          checked={settings.enableSlack}
          onCheckedChange={() => handleSwitchChange("enableSlack")}
        />
        <Label htmlFor="enableSlack">تفعيل تكامل Slack</Label>
      </div>
      <div>
        <Label htmlFor="zapierWebhookUrl">رابط Webhook لـ Zapier</Label>
        <Input
          id="zapierWebhookUrl"
          name="zapierWebhookUrl"
          value={settings.zapierWebhookUrl}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableZapier"
          checked={settings.enableZapier}
          onCheckedChange={() => handleSwitchChange("enableZapier")}
        />
        <Label htmlFor="enableZapier">تفعيل تكامل Zapier</Label>
      </div>
      <Button type="submit">حفظ إعدادات التكاملات</Button>
    </form>
  )
}

