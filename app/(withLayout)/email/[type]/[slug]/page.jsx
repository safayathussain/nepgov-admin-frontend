"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/Button";
import ConfirmModal from "@/components/modal/ConfirmModal";
import SelectInput from "@/components/input/DropdownInput";
import { FetchApi } from "@/utils/FetchApi";
import TextEditor from "@/components/input/texteditor/TextEditor";

const DetailPage = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    subject: "",
    htmlContent: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { type, slug } = useParams();
  const [id, setId] = useState(null);
  const router = useRouter();
  const editorRef = useRef(null);
  const isCategory = type === "category";
  const baseUrl = isCategory ? "/email-category" : "/email-template";
  const redirectTab = isCategory ? "category" : "template";

  useEffect(() => {
    if (slug !== "add") {
      setId(slug);
    } else {
      setId(null);
    }
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const { data: responseData } = await FetchApi({
            url: `${baseUrl}/${id}`,
          });
          setData({
            name: responseData.data.name,
            description: responseData.data.description || "",
            subject: responseData.data.subject || "",
            htmlContent: responseData.data.htmlContent || "",
            category: responseData.data.category?._id || "",
          });
        }

        if (!isCategory) {
          const { data: categoryData } = await FetchApi({
            url: "/email-category",
          });
          if (categoryData?.success) {
            setCategories(
              categoryData.data.map((cat) => ({
                value: cat._id,
                name: cat.name,
              }))
            );
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, type, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = id ? `${baseUrl}/update/${id}` : `${baseUrl}/create`;
    const method = id ? "put" : "post";

    setIsLoading(true);
    try {
      await FetchApi({
        method,
        url: apiUrl,
        data,
        isToast: true,
        callback: () => router.push(`/email?tab=${redirectTab}`),
      });
    } catch (error) {
      console.error(`Failed to submit ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "delete",
        url: `${baseUrl}/delete/${id}`,
        isToast: true,
        callback: () => router.push(`/email?tab=${redirectTab}`),
      });
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id
          ? `Edit ${isCategory ? "Category" : "Template"}`
          : `Add ${isCategory ? "Category" : "Template"}`}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-3">
        <TextInput
          label="Name"
          name="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        {isCategory ? (
          <></>
        ) : (
          <>
            <TextInput
              label="Subject"
              name="subject"
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              required
            />
            <TextEditor
              name="htmlContent"
              label="Content"
              editor={editorRef}
              content={data.htmlContent}
              setContent={(content) =>
                setData({ ...data, htmlContent: content })
              }
              extraButtons={[
                {
                  name: "[first name]",
                  icon: "user",
                  tooltip: "Insert First Name",
                  exec: (editor) => {
                    editor.s.insertHTML("<strong>[first name]</strong>");
                  },
                },
              ]}
            />
            <SelectInput
              label="Category"
              name="category"
              value={data.category}
              setValue={(e) => setData({ ...data, category: e })}
              options={categories}
              required
            />
          </>
        )}
        <div className="mt-4 flex gap-4 items-center">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : id
              ? `Update ${isCategory ? "Category" : "Template"}`
              : `Add ${isCategory ? "Category" : "Template"}`}
          </Button>
          {id && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isLoading}
            >
              Delete {isCategory ? "Category" : "Template"}
            </Button>
          )}
        </div>
      </form>
      <ConfirmModal
        title={`Are you sure you want to delete this ${
          isCategory ? "category" : "template"
        }?`}
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </div>
  );
};

export default DetailPage;
