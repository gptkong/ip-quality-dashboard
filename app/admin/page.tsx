"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Check, X, ArrowLeft, LogOut, Lock } from "lucide-react"
import Link from "next/link"
import type { ServerWithMeta, ServerData, ServerDataOrArray } from "@/lib/mock-data"

function getFirstData(data: ServerDataOrArray): ServerData {
  if (Array.isArray(data) && data.length > 0 && 'Head' in data[0]) {
    return data[0] as ServerData
  }
  return data as ServerData
}

// 登录表单组件
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        onLogin()
      } else {
        const data = await res.json()
        setError(data.error || "登录失败")
      }
    } catch {
      setError("网络错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>管理后台</CardTitle>
          <CardDescription>请输入管理密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !password}>
              {loading ? "验证中..." : "登录"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              返回首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [servers, setServers] = useState<ServerWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)

  // 检查认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/auth")
      setAuthenticated(res.ok)
      if (res.ok) {
        fetchServers()
      } else {
        setLoading(false)
      }
    } catch {
      setAuthenticated(false)
      setLoading(false)
    }
  }

  async function fetchServers() {
    try {
      const res = await fetch("/api/servers")
      const data = await res.json()
      setServers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch servers:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    setAuthenticated(false)
  }

  function startEdit(server: ServerWithMeta) {
    setEditingId(server.id)
    setEditValue(server.remark || "")
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValue("")
  }

  async function saveRemark(serverId: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/servers/${serverId}/remark`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark: editValue.trim() }),
      })
      
      if (res.ok) {
        setServers(servers.map(s => 
          s.id === serverId ? { ...s, remark: editValue.trim() || null } : s
        ))
        setEditingId(null)
        setEditValue("")
      }
    } catch (error) {
      console.error("Failed to save remark:", error)
    } finally {
      setSaving(false)
    }
  }

  // 检查认证状态中
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  // 未认证，显示登录表单
  if (!authenticated) {
    return <LoginForm onLogin={() => { setAuthenticated(true); setLoading(true); fetchServers() }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">服务器管理</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>服务器备注管理</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP 地址</TableHead>
                  <TableHead>组织</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => {
                  const firstData = getFirstData(server.data)
                  const ip = firstData.Head[0].IP
                  const org = firstData.Info[0].Organization
                  const isEditing = editingId === server.id

                  return (
                    <TableRow key={server.id}>
                      <TableCell className="font-mono">{ip}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {org}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="输入备注..."
                            className="h-8"
                            maxLength={100}
                            autoFocus
                          />
                        ) : (
                          <span className={server.remark ? "" : "text-muted-foreground"}>
                            {server.remark || "无备注"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => saveRemark(server.id)}
                              disabled={saving}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => startEdit(server)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {servers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">暂无服务器数据</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
