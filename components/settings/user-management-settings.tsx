"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type Role = {
  id: string
  name: string
}

const availableRoles: Role[] = [
  { id: "1", name: "مدير" },
  { id: "2", name: "مشرف" },
  { id: "3", name: "مستخدم" },
]

export function UserManagementSettings() {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "أحمد محمد", email: "ahmed@example.com", role: "مدير" },
    { id: "2", name: "فاطمة علي", email: "fatima@example.com", role: "مشرف" },
  ])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value }))
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const id = (users.length + 1).toString()
    setUsers([...users, { id, ...newUser }])
    setNewUser({ name: "", email: "", password: "", role: "" })
    toast({
      title: "تمت إضافة المستخدم بنجاح",
      description: `تم إضافة ${newUser.name} كـ ${newUser.role}`,
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input
            id="name"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">الدور</Label>
          <Select onValueChange={handleRoleChange} value={newUser.role}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">إضافة مستخدم جديد</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الدور</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">تعديل</Button>
                <Button variant="destructive" size="sm" className="mr-2">حذف</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

