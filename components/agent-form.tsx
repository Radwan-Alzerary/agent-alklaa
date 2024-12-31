"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createAgent, updateAgent } from "@/lib/api"

interface AgentFormProps {
  agent?: {
    id?:string;
    _id?: string; // Adjusted to optional
    name: string;
    email: string;
    phone: string;
    role: string;
    assignedCustomers: number
  }
}

export function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter()

  const [name, setName] = useState(agent?.name || "")
  const [email, setEmail] = useState(agent?.email || "")
  const [phone, setPhone] = useState(agent?.phone || "")
  const [role, setRole] = useState(agent?.role || "")
  const [totalSales, setTotalSales] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [assignedCustomers, setAssignedCustomers] = useState(agent?.assignedCustomers || 0)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords if creating a new agent or updating the password
    if (!agent || (password || confirmPassword)) {
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long")
        return
      }
    }

    setIsLoading(true)
    try {
      const agentData: any = {
        name,
        email,
        phone,
        role,
        totalSales,
        averageRating,
        assignedCustomers,
      }

      // Include password only if it's provided
      if (password) {
        agentData.password = password
      }

      if (agent) {
        await updateAgent(agent._id as string, agentData)
        // alert("تم تحديث الوكيل بنجاح")
      } else {
        await createAgent(agentData)
        // alert("تمت إضافة الوكيل بنجاح")
      }
      router.push("/agents")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("حدث خطأ أثناء حفظ بيانات الوكيل")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing Fields */}
      <div>
        <Label htmlFor="name">الاسم</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="assignedCustomers">العملاء المعينون</Label>
        <Input
          id="assignedCustomers"
          type="number"
          value={assignedCustomers}
          onChange={(e) => setAssignedCustomers(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="totalSales">إجمالي المبيعات</Label>
        <Input
          id="totalSales"
          type="number"
          value={totalSales}
          onChange={(e) => setTotalSales(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="averageRating">متوسط التقييم</Label>
        <Input
          id="averageRating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={averageRating}
          onChange={(e) => setAverageRating(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">الدور</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {role || "اختر الدور"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>أدوار الوكلاء</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRole("مدير المبيعات")}>
              مدير المبيعات
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("مندوب مبيعات")}>
              مندوب مبيعات
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("مدير حسابات العملاء")}>
              مدير حسابات العملاء
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New Password Fields */}
      <div>
        <Label htmlFor="password">
          {agent ? "تغيير كلمة المرور" : "كلمة المرور"}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={agent ? "اتركه فارغاً إذا لم ترغب في تغييره" : ""}
          required={!agent} // Required only when creating a new agent
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={agent ? "اتركه فارغاً إذا لم ترغب في تغييره" : ""}
          required={!agent} // Required only when creating a new agent
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? "جاري الحفظ..."
          : agent
          ? "تحديث الوكيل"
          : "إضافة الوكيل"}
      </Button>
    </form>
  )
}
