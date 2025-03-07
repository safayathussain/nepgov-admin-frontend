"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import DropdownInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import DateTimePicker from "@/components/input/DateTimePicker";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { IoClose } from "react-icons/io5";

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

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    // Filter out empty options
    const filteredOptions = trackerData.options.filter(
      (option) => option && option.content.trim()
    );

    const formattedData = {
      ...trackerData,
      options: filteredOptions,
      // Include editedOptions and deletedOptions for the API
      editedOptions: trackerData.editedOptions.filter(
        (option) => option && option.content?.trim()
      ),
      deletedOptions: trackerData.deletedOptions,
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
        <div className="hidden md:block"></div>
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
      <div>
        <label className="block text-black text-[15px] mb-1">
          Options (Min: 2, Max: 4)
        </label>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((index) => {
            const option = trackerData.options[index] || {
              content: "",
              color: "#000000",
            };
            return (
              <div key={index} className="flex space-x-2 items-center w-max">
                <TextInput
                  placeholder={`Option ${index + 1}`}
                  value={option.content || ""}
                  onChange={(e) => {
                    const newOptions = [...trackerData.options];
                    // Ensure we have enough slots in the array
                    while (newOptions.length <= index) {
                      newOptions.push({ content: "", color: "#000000" });
                    }

                    const newContent = e.target.value;
                    newOptions[index] = {
                      ...newOptions[index],
                      content: newContent,
                    };

                    // Handle editedOptions
                    let editedOptions = [...trackerData.editedOptions];

                    if (newOptions[index]._id) {
                      // If content is cleared, remove from editedOptions
                      if (!newContent.trim()) {
                        editedOptions = editedOptions.filter(
                          (opt) => opt._id !== newOptions[index]._id
                        );
                      } else {
                        // Otherwise update or add to editedOptions
                        const existingIndex = editedOptions.findIndex(
                          (opt) => opt._id === newOptions[index]._id
                        );
                        if (existingIndex >= 0) {
                          editedOptions[existingIndex] = newOptions[index];
                        } else {
                          editedOptions.push(newOptions[index]);
                        }
                      }
                    } else if (newContent.trim()) {
                      // For new options, only add to editedOptions if they have content
                      const existingIndex = editedOptions.findIndex(
                        (opt) =>
                          opt === newOptions[index] ||
                          (opt.tempId &&
                            opt.tempId === newOptions[index].tempId)
                      );

                      if (existingIndex >= 0) {
                        editedOptions[existingIndex] = newOptions[index];
                      } else {
                        // Add a temporary ID to track this option in editedOptions
                        newOptions[index].tempId = Date.now() + index;
                        editedOptions.push(newOptions[index]);
                      }
                    }

                    setTrackerData((prev) => ({
                      ...prev,
                      options: newOptions,
                      editedOptions,
                    }));
                  }}
                  className="w-full"
                />
                <input
                  type="color"
                  value={option.color || "#000000"}
                  onChange={(e) => {
                    const newOptions = [...trackerData.options];
                    // Ensure we have enough slots in the array
                    while (newOptions.length <= index) {
                      newOptions.push({ content: "", color: "#000000" });
                    }
                    newOptions[index] = {
                      ...newOptions[index],
                      color: e.target.value,
                    };

                    // Handle editedOptions
                    const editedOptions = [...trackerData.editedOptions];

                    if (newOptions[index]._id) {
                      const existingIndex = editedOptions.findIndex(
                        (opt) => opt._id === newOptions[index]._id
                      );
                      if (existingIndex >= 0) {
                        editedOptions[existingIndex] = newOptions[index];
                      } else {
                        editedOptions.push(newOptions[index]);
                      }
                    } else if (newOptions[index].content?.trim()) {
                      // For new options, only add to editedOptions if they have content
                      const existingIndex = editedOptions.findIndex(
                        (opt) =>
                          opt === newOptions[index] ||
                          (opt.tempId &&
                            opt.tempId === newOptions[index].tempId)
                      );

                      if (existingIndex >= 0) {
                        editedOptions[existingIndex] = newOptions[index];
                      } else {
                        // Add a temporary ID to track this option in editedOptions
                        newOptions[index].tempId = Date.now() + index;
                        editedOptions.push(newOptions[index]);
                      }
                    }

                    setTrackerData((prev) => ({
                      ...prev,
                      options: newOptions,
                      editedOptions,
                    }));
                  }}
                  className="h-10 w-10"
                />
                <div className="w-5">
                  {trackerData.options[index]?.content && (
                    <button
                      type="button"
                      className=" text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => {
                        const optionToRemove = trackerData.options[index];

                        // Update deletedOptions and editedOptions
                        const newDeletedOptions = [
                          ...trackerData.deletedOptions,
                        ];
                        let newEditedOptions = [...trackerData.editedOptions];

                        if (optionToRemove && optionToRemove._id) {
                          // If it's an existing option with an ID, add to deletedOptions
                          newDeletedOptions.push(optionToRemove);

                          // Remove from editedOptions if present
                          newEditedOptions = newEditedOptions.filter(
                            (opt) => opt._id !== optionToRemove._id
                          );
                        } else {
                          // For new options, just remove from editedOptions
                          newEditedOptions = newEditedOptions.filter(
                            (opt) =>
                              opt !== optionToRemove &&
                              (!opt.tempId ||
                                opt.tempId !== optionToRemove.tempId)
                          );
                        }

                        // Remove the option from the options array
                        const newOptions = [...trackerData.options];
                        newOptions.splice(index, 1);

                        // Ensure we maintain at least empty placeholders for the UI
                        while (newOptions.length < 4) {
                          newOptions.push({ content: "", color: "#000000" });
                        }

                        setTrackerData((prev) => ({
                          ...prev,
                          options: newOptions,
                          deletedOptions: newDeletedOptions,
                          editedOptions: newEditedOptions,
                        }));
                      }}
                    >
                      <IoClose className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
