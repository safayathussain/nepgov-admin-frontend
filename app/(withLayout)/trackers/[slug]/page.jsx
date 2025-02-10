"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { FetchApi } from "@/utils/FetchApi"
import TextInput from "@/components/input/TextInput"
import DropdownInput from "@/components/input/DropdownInput"
import Button from "@/components/input/Button"
import DateTimePicker from "@/components/input/DateTimePicker"

const TrackerForm = () => {
  const [trackerData, setTrackerData] = useState({
    topic: "",
    options: [],
    editedOptions: [], // Track edited options
    deletedOptions: [], // Track deleted options
    categories: null,
    liveEndedAt: "",
  })
  const [categoryOptions, setCategoryOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [newOptionContent, setNewOptionContent] = useState("")
  const [newOptionColor, setNewOptionColor] = useState("#000000") // Add this line
  const { slug } = useParams()
  const router = useRouter()

  const isEditing = slug !== "create"

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const { data } = await FetchApi({ url: "/category" })
        if (data?.success) {
          setCategoryOptions(
            data.data.map((category) => ({
              name: category.name,
              value: category._id,
              _id: category._id,
            })),
          )
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (isEditing) {
      const fetchTrackerData = async () => {
        setIsLoading(true)
        try {
          const { data } = await FetchApi({ url: `/tracker/${slug}` })
          if (data?.data) {
            setTrackerData({
              topic: data.data.topic,
              options: data.data.options,
              categories: data.data.categories.length > 0 ? data.data.categories[0] : null,
              liveEndedAt: data.data.liveEndedAt,
              editedOptions: [], // Reset editedOptions when fetching tracker data
              deletedOptions: [], // Reset deletedOptions
            })
          }
        } catch (error) {
          console.error("Failed to fetch tracker:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchTrackerData()
    }
  }, [slug, isEditing])

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...trackerData.options]
    newOptions[index][field] = value
    setTrackerData({ ...trackerData, options: newOptions })

    // Track changes in the editedOptions array
    const updatedEditedOptions = [...trackerData.editedOptions]
    const existingEditedOptionIndex = updatedEditedOptions.findIndex((opt) => opt._id === newOptions[index]._id)

    if (existingEditedOptionIndex > -1) {
      updatedEditedOptions[existingEditedOptionIndex] = newOptions[index]
    } else {
      updatedEditedOptions.push(newOptions[index])
    }
    setTrackerData({ ...trackerData, editedOptions: updatedEditedOptions })
  }

  const addOption = async () => {
    if (!newOptionContent.trim()) return // Don't add empty options

    const newOption = { content: newOptionContent, color: newOptionColor }

    if (!isEditing) {
      setTrackerData({
        ...trackerData,
        options: [...trackerData.options, newOption],
      })
      setNewOptionContent("") // Clear the input
      setNewOptionColor("#000000") // Reset color to default
      return
    }

    setIsLoading(true)
    try {
      const { data } = await FetchApi({
        method: "post",
        url: `/tracker/add-option/${slug}`,
        data: newOption,
      })

      if (data?.success) {
        setTrackerData((prev) => ({
          ...prev,
          options: [...prev.options, data.data],
        }))
        setNewOptionContent("") // Clear the input
        setNewOptionColor("#000000") // Reset color to default
      }
    } catch (error) {
      console.error("Failed to add option:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeOption = (index) => {
    const optionToRemove = trackerData.options[index]

    setTrackerData((prevData) => ({
      ...prevData,
      options: prevData.options.filter((_, i) => i !== index),
      deletedOptions: [...prevData.deletedOptions, optionToRemove],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formattedData = {
      ...trackerData,
      categories: trackerData.categories ? [trackerData.categories._id] : [],
      editedOptions: trackerData.editedOptions, // Include edited options
      deletedOptions: trackerData.deletedOptions, // Include deleted options
    }

    const apiUrl = isEditing ? `/tracker/update/${slug}` : `/tracker/create`
    const method = isEditing ? "put" : "post"

    try {
      await FetchApi({
        method,
        url: apiUrl,
        data: formattedData,
        isToast: true,
      })
      router.push("/trackers")
    } catch (error) {
      console.error("Failed to submit tracker:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
      <TextInput
        label="Topic"
        name="topic"
        value={trackerData.topic}
        onChange={(e) => setTrackerData({ ...trackerData, topic: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-5">
        <DropdownInput
          name="categories"
          label="Select Category"
          options={categoryOptions}
          value={trackerData.categories?._id || ""}
          setValue={(value) =>
            setTrackerData({
              ...trackerData,
              categories: categoryOptions.find((it) => it.value === value) || null,
            })
          }
        />
        <DateTimePicker
          label="Live End Date"
          value={trackerData.liveEndedAt}
          onChange={(value) => setTrackerData({ ...trackerData, liveEndedAt: value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>

        {trackerData.options.map((option, index) => (
          <div key={index} className="flex space-x-2">
            <TextInput
              placeholder="Option content"
              value={option.content}
              onChange={(e) => handleOptionChange(index, "content", e.target.value)}
              required
              className={'w-full'}
              />
            <input
              type="color"
              value={option.color}
              onChange={(e) => handleOptionChange(index, "color", e.target.value)}
              className="h-10 w-10"
              />
            {trackerData.options.length > 1 && (
              <Button type="button" onClick={() => removeOption(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <div className="flex space-x-2">
          <TextInput
            placeholder="New option content"
            value={newOptionContent}
            onChange={(e) => setNewOptionContent(e.target.value)}
          />
          <input
            type="color"
            value={newOptionColor}
            onChange={(e) => setNewOptionColor(e.target.value)}
            className="h-10 w-10"
          />
          <Button type="button" onClick={addOption} disabled={isLoading || !newOptionContent.trim()}>
            Add Option
          </Button>
        </div>
      </div>
      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Tracker" : "Create Tracker"}
        </Button>
      </div>
    </form>
  )
}

export default TrackerForm

