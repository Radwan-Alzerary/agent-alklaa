"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type Permission = {
  id: string
  name: string
}

type Role = {
  id: string
  name: string
  permissions: string[]
}

const availablePermissions: Permission[] = [
  { id: "1", name: "إدارة المستخدمين" },
  { id: "2", name: "إدارة الأدوار" },
  { id: "3", name: "إدارة المنتجات" },
  { id: "4", name: "إدارة الطلبات" },
  { id: "5", name: "إدارة التقارير" },
]

export function RoleManagementSettings() {
  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "مدير", permissions: ["1", "2", "3", "4", "5"] },
    { id: "2", name: "مشرف", permissions: ["3", "4"] },
  ])

  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewRole((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (permissionId: string) => {
    setNewRole((prev) => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId]
      return { ...prev, permissions: updatedPermissions }
    })
  }

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault()
    const id = (roles.length + 1).toString()
    setRoles([...roles, { id, ...newRole }])
    setNewRole({ name: "", permissions: [] })
    toast({
      title: "تمت إضافة الدور بنجاح",
      description: `تم إضافة دور ${newRole.name}`,
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddRole} className="space-y-4">
        <div>
          <Label htmlFor="name">اسم الدور</Label>
          <Input
            id="name"
            name="name"
            value={newRole.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label>الصلاحيات</Label>
          <div className="grid grid-cols-2 gap-4">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Switch
                  id={`permission-${permission.id}`}
                  checked={newRole.permissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
                <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit">إضافة دور جديد</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم الدور</TableHead>
            <TableHead>الصلاحيات</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.permissions.map((permId) => (
                  availablePermissions.find(p => p.id === permId)?.name
                )).join(", ")}
              </TableCell>
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

