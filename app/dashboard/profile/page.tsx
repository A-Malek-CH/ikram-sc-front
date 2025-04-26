"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { userAPI } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, Camera, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, token, updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    gender: "",
    speciality: "",
  })

  const [newEmail, setNewEmail] = useState("")
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        birth_date: user.birth_date || "",
        gender: user.gender || "",
        speciality: user.speciality || "",
      })
    }
  }, [user])

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setIsLoading(true)

    try {
      await userAPI.changeProfilePicture(token, file)
      toast({
        title: "تم تغيير الصورة",
        description: "تم تغيير صورة الملف الشخصي بنجاح",
      })
      setProfileData({ ...profileData })
    } catch (error) {
      console.error("Failed to change profile picture:", error)
      toast({
        title: "فشل تغيير الصورة",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تغيير صورة الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      updateUser({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      })
      setIsEditing(false)
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "فشل تحديث الملف الشخصي",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      await userAPI.changeEmail(token, newEmail)
      setProfileData({ ...profileData, email: newEmail })
      updateUser({ email: newEmail })
      setActiveTab("profile")
      setNewEmail("")
      toast({
        title: "تم تغيير البريد الإلكتروني",
        description: "تم تغيير البريد الإلكتروني بنجاح",
      })
    } catch (error) {
      console.error("Failed to change email:", error)
      toast({
        title: "فشل تغيير البريد الإلكتروني",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تغيير البريد الإلكتروني",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!token) return
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور الجديدة غير متطابقة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await userAPI.changePassword(token, passwordData.old_password, passwordData.new_password)
      setActiveTab("profile")
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      })
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      })
    } catch (error) {
      console.error("Failed to change password:", error)
      toast({
        title: "فشل تغيير كلمة المرور",
        description: error instanceof Error ? error.message : "كلمة المرور الحالية غير صحيحة أو حدث خطأ آخر",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#1D3557] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-[#1D3557]">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
        <h1 className="text-3xl font-bold text-[#1D3557]">الملف الشخصي</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#1D3557] text-[#1D3557] hover:bg-[#A8DADC] hover:text-[#1D3557]"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading || activeTab !== "profile"}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 ml-2" />
                إلغاء التعديل
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 ml-2" />
                تعديل الملف الشخصي
              </>
            )}
          </Button>

          {isEditing && (
            <Button className="bg-[#1D3557] hover:bg-[#0F1C2D]" onClick={handleSaveProfile} disabled={isLoading}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Component Wrapping Both Cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Profile Card - md:col-span-1 */}
        <Card className="md:col-span-1 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                  {user.id ? (
                    <AvatarImage
                      src={userAPI.getProfilePictureUrl(user.id) || "/placeholder.svg"}
                      alt={user.first_name}
                    />
                  ) : null}
                  <AvatarFallback className="text-3xl bg-[#A8DADC] text-[#1D3557]">
                    {user.first_name?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-[#1D3557] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#0F1C2D] transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    disabled={isLoading}
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold mt-4 text-[#1D3557]">{`${user.first_name} ${user.last_name}`}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {user.speciality && (
                <Badge className="mt-2 bg-[#A8DADC] text-[#1D3557] hover:bg-[#E1E8ED]">{user.speciality}</Badge>
              )}
            </div>

            <div className="mt-8">
              <TabsList className="grid grid-cols-3 w-full bg-[#A8DADC]">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-[#1D3557] data-[state=active]:text-white"
                >
                  الملف
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-[#1D3557] data-[state=active]:text-white">
                  البريد
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-[#1D3557] data-[state=active]:text-white"
                >
                  كلمة المرور
                </TabsTrigger>
              </TabsList>
            </div>
          </CardContent>
        </Card>

        {/* Right Content Card - md:col-span-3 */}
        <Card className="md:col-span-3 border-none shadow-md">
          {/* Profile Tab Content */}
          <TabsContent value="profile" className="mt-0">
            <CardHeader>
              <CardTitle className="text-xl text-[#1D3557]">معلومات الملف الشخصي</CardTitle>
              <CardDescription>{isEditing ? "قم بتعديل معلوماتك الشخصية" : "عرض معلوماتك الشخصية"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-[#1D3557]">
                      الاسم الأول
                    </Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-[#1D3557]">
                      اسم العائلة
                    </Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="speciality" className="text-[#1D3557]">
                      التخصص
                    </Label>
                    <Input
                      id="speciality"
                      value={profileData.speciality || ""}
                      onChange={(e) => setProfileData({ ...profileData, speciality: e.target.value })}
                      className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#A8DADC] p-4 rounded-lg">
                      <p className="text-sm font-medium text-[#1D3557] mb-1">الاسم الأول</p>
                      <p className="text-lg font-medium text-[#1D3557]">{profileData.first_name}</p>
                    </div>
                    <div className="bg-[#A8DADC] p-4 rounded-lg">
                      <p className="text-sm font-medium text-[#1D3557] mb-1">اسم العائلة</p>
                      <p className="text-lg font-medium text-[#1D3557]">{profileData.last_name}</p>
                    </div>
                  </div>

                  <div className="bg-[#A8DADC] p-4 rounded-lg">
                    <p className="text-sm font-medium text-[#1D3557] mb-1">البريد الإلكتروني</p>
                    <p className="text-lg font-medium text-[#1D3557]">{profileData.email}</p>
                  </div>

                  {profileData.speciality && (
                    <div className="bg-[#A8DADC] p-4 rounded-lg">
                      <p className="text-sm font-medium text-[#1D3557] mb-1">التخصص</p>
                      <p className="text-lg font-medium text-[#1D3557]">{profileData.speciality}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </TabsContent>

          {/* Email Tab Content */}
          <TabsContent value="email" className="mt-0">
            <CardHeader>
              <CardTitle className="text-xl text-[#1D3557]">تغيير البريد الإلكتروني</CardTitle>
              <CardDescription>أدخل البريد الإلكتروني الجديد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email" className="text-[#1D3557]">
                  البريد الإلكتروني الحالي
                </Label>
                <Input id="current-email" value={profileData.email} disabled className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-[#1D3557]">
                  البريد الإلكتروني الجديد
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("profile")
                  setNewEmail("")
                }}
                disabled={isLoading}
                className="border-gray-300"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleChangeEmail}
                disabled={isLoading || !newEmail}
                className="bg-[#1D3557] hover:bg-[#0F1C2D]"
              >
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardFooter>
          </TabsContent>

          {/* Password Tab Content */}
          <TabsContent value="password" className="mt-0">
            <CardHeader>
              <CardTitle className="text-xl text-[#1D3557]">تغيير كلمة المرور</CardTitle>
              <CardDescription>أدخل كلمة المرور الحالية وكلمة المرور الجديدة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password" className="text-[#1D3557]">
                  كلمة المرور الحالية
                </Label>
                <Input
                  id="old-password"
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  required
                  className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[#1D3557]">
                  كلمة المرور الجديدة
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                  className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[#1D3557]">
                  تأكيد كلمة المرور الجديدة
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  required
                  className="border-[#1D3557] focus:border-[#1D3557] focus-visible:ring-[#1D3557]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("profile")
                  setPasswordData({
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                  })
                }}
                disabled={isLoading}
                className="border-gray-300"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={
                  isLoading ||
                  !passwordData.old_password ||
                  !passwordData.new_password ||
                  !passwordData.confirm_password
                }
                className="bg-[#1D3557] hover:bg-[#0F1C2D]"
              >
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardFooter>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}