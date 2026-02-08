'use client'

import { PageHeader, PageContent, Button, Input } from '@/components'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Mail } from 'lucide-react'

export default function ExemploPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <PageHeader
        title="User List"
        description="Manage your users and their roles here."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Invite User
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Filter users..."
              className="h-9 w-full md:w-64"
            />
            <Select defaultValue="">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>

        <div className="rounded-md border bg-white">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Seu componente DataTable vai aqui
            </p>
          </div>
        </div>
      </PageContent>
    </div>
  )
}
