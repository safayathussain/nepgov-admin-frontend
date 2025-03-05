"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import DropdownInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import DateTimePicker from "@/components/input/DateTimePicker";
import ConfirmModal from "@/components/modal/ConfirmModal";

const TrackerForm = () => {
  const [trackerData, setTrackerData] = useState({
    topic: "",
    options: [],
    editedOptions: [],
    deletedOptions: [],
    categories: null,
    liveEndedAt: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newOptionContent, setNewOptionContent] = useState("");
  const [newOptionColor, setNewOptionColor] = useState("#000000");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  const isEditing = slug !== "add";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await FetchApi({ url: "/category" });
        if (data?.success && Array.isArray(data.data)) {
          setCategoryOptions(
            data.data.map((category) => ({
              name: category.name,
              value: category._id,
              _id: category._id,
            }))
          );
        } else {
          console.error("Unexpected category data format:", data);
          setCategoryOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoryOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchTrackerData = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/tracker/${slug}` });
          if (data?.data) {
            setTrackerData({
              topic: data.data.topic,
              options: data.data.options || [],
              categories:
                data.data.categories && data.data.categories.length > 0
                  ? data.data.categories[0]
                  : null,
              liveEndedAt: data.data.liveEndedAt || "",
              liveStartedAt: data.data.liveStartedAt || "",
              editedOptions: [],
              deletedOptions: [],
            });
          }
        } catch (error) {
          console.error("Failed to fetch tracker:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTrackerData();
    }
  }, [slug, isEditing]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...trackerData.options];
    newOptions[index][field] = value;
    setTrackerData((prev) => ({
      ...prev,
      options: newOptions,
      editedOptions: [
        ...prev.editedOptions.filter(
          (opt) => opt._id !== newOptions[index]._id
        ),
        newOptions[index],
      ],
    }));
  };

  const addOption = () => {
    if (!newOptionContent.trim()) return;

    const newOption = { content: newOptionContent, color: newOptionColor };
    setTrackerData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
      editedOptions: [...prev.editedOptions, newOption],
    }));
    setNewOptionContent("");
    setNewOptionColor("#000000");
  };

  const removeOption = (index) => {
    const optionToRemove = trackerData.options[index];
    setTrackerData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      deletedOptions: [...prev.deletedOptions, optionToRemove],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedData = {
      ...trackerData,
      categories: trackerData.categories ? [trackerData.categories._id] : [],
    };

    const apiUrl = isEditing ? `/tracker/update/${slug}` : `/tracker/create`;
    const method = isEditing ? "put" : "post";

    try {
      await FetchApi({
        method,
        url: apiUrl,
        data: formattedData,
        isToast: true,
        callback: () => router.push("/trackers"),
      });
    } catch (error) {
      console.error("Failed to submit tracker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "delete",
        url: `/tracker/delete/${slug}`,
        isToast: true,
        callback: () => router.push("/trackers"),
      });
    } catch (error) {
      console.error("Failed to delete tracker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
      <TextInput
        label="Topic"
        name="topic"
        value={trackerData.topic}
        onChange={(e) =>
          setTrackerData({ ...trackerData, topic: e.target.value })
        }
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DropdownInput
          name="categories"
          label="Select Category"
          options={categoryOptions}
          value={trackerData.categories?._id || ""}
          setValue={(value) =>
            setTrackerData({
              ...trackerData,
              categories:
                categoryOptions.find((it) => it.value === value) || null,
            })
          }
        />
        <div className="hidden md:block">

        </div>
          <DateTimePicker
            label="Live Start Date"
            value={trackerData.liveStartedAt}
            onChange={(value) =>
              setTrackerData({ ...trackerData, liveStartedAt: value })
            }
            required
          />
        <DateTimePicker
          label="Live End Date"
          value={trackerData.liveEndedAt}
          onChange={(value) =>
            setTrackerData({ ...trackerData, liveEndedAt: value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        {trackerData.options.map((option, index) => (
          <div key={index} className="flex space-x-2">
            <TextInput
              placeholder="Option content"
              value={option.content}
              onChange={(e) =>
                handleOptionChange(index, "content", e.target.value)
              }
              required
              className="w-full"
            />
            <input
              type="color"
              value={option.color}
              onChange={(e) =>
                handleOptionChange(index, "color", e.target.value)
              }
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
          <Button
            type="button"
            onClick={addOption}
            disabled={isLoading || !newOptionContent.trim()}
          >
            Add Option
          </Button>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Tracker"
            : "Create Tracker"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isLoading}
          >
            Delete Tracker
          </Button>
        )}
      </div>
      <ConfirmModal
        title="Are you sure you want to delete this tracker?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </form>
  );
};

export default TrackerForm;
