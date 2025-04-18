"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { FetchApi } from "@/utils/FetchApi"
import TextEditor from "@/components/input/texteditor/TextEditor"
import TextInput from "@/components/input/TextInput"
import DropdownInput from "@/components/input/DropdownInput"
import Button from "@/components/input/Button"
import ConfirmModal from "@/components/modal/ConfirmModal"

const StaticPage = () => {
  const [pageData, setPageData] = useState({
    title: "",
    content: "",
    page: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { slug } = useParams()
  const router = useRouter()
  const editorRef = useRef(null)

  const pageOptions = [
    { name: "Cookie Policy", value: "cookie-policy" },
    { name: "About Us", value: "about-us" },
    { name: "Privacy Policy", value: "privacy-policy" },
    { name: "Terms and Conditions", value: "terms-and-conditions" },
  ]

  const isEditing = slug !== "add"

  useEffect(() => {
    if (isEditing) {
      const fetchPageData = async () => {
        setIsLoading(true)
        try {
          const { data } = await FetchApi({ url: `/static-page/${slug}` })
          if (data?.data) {
            setPageData({
              title: data.data.title,
              content: data.data.content,
              page: data.data.page,
            })
          }
        } catch (error) {
          console.error("Failed to fetch page:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchPageData()
    }
  }, [slug, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const apiUrl = isEditing ? `/static-page/update/${slug}` : "/static-page/create"
    const method = isEditing ? "put" : "post"

    try {
      await FetchApi({
        method,
        url: apiUrl,
        data: pageData,
        isToast: true,
        callback: () => router.push("/static-pages"),
      })
    } catch (error) {
      console.error("Failed to submit page:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await FetchApi({
        method: "delete",
        url: `/static-page/delete/${slug}`,
        isToast: true,
        callback: () => router.push("/static-pages"),
      })
    } catch (error) {
      console.error("Failed to delete page:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
      <TextInput
        label="Page Title"
        name="title"
        value={pageData.title}
        onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
        required
      />

      <DropdownInput
        name="page"
        placeholder="Select Page"
        options={pageOptions}
        value={pageData.page}
        setValue={(value) => setPageData({ ...pageData, page: value })}
      />

      <TextEditor
        label="Content"
        editor={editorRef}
        content={pageData.content}
        setContent={(content) => setPageData({ ...pageData, content })}
      />

      <div className="flex gap-4 items-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Page" : "Create Page"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isLoading}
          >
            Delete Page
          </Button>
        )}
      </div>

      <ConfirmModal
        title="Are you sure you want to delete this page?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </form>
  )
}

export default StaticPage

