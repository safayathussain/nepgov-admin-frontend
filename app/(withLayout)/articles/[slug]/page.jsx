"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextEditor from "@/components/input/texteditor/TextEditor";
import TextInput from "@/components/input/TextInput";
import DropdownInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import FileInput from "@/components/input/FileInput";
import ConfirmModal from "@/components/modal/ConfirmModal";

const ManageArticle = () => {
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    categories: [],
    thumbnail: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const editorRef = useRef(null);

  const isEditing = slug !== "add";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await FetchApi({ url: "/category" });
        if (data?.success) {
          setCategoryOptions(
            data.data.map((category) => ({
              name: category.name,
              value: category._id,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch article data when editing
  useEffect(() => {
    if (isEditing) {
      const fetchArticleData = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/article/${slug}` });
          if (data?.data) {
            setArticleData({
              title: data.data.title,
              content: data.data.content,
              categories: data.data.categories?.[0]?._id,
              thumbnail: data.data.thumbnail,
            });
          }
        } catch (error) {
          console.error("Failed to fetch article:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticleData();
    }
  }, [slug, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiUrl = isEditing ? `/article/update/${slug}` : "/article/create";
    const method = isEditing ? "put" : "post";

    try {
      const formData = new FormData();
      formData.append("title", articleData.title);
      formData.append("content", articleData.content);
      formData.append("categories[0]", articleData.categories);
      if (articleData.thumbnail) {
        formData.append("thumbnail", articleData.thumbnail);
      }

      await FetchApi({
        method,
        url: apiUrl,
        data: formData,
        isToast: true,
        callback: () => router.push("/articles"),
      });
    } catch (error) {
      console.error("Failed to submit article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "delete",
        url: `/article/delete/${slug}`,
        isToast: true,
        callback: () => router.push("/articles"),
      });
    } catch (error) {
      console.error("Failed to delete article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
      <FileInput
        img={
          typeof articleData.thumbnail === "string"
            ? process.env.NEXT_PUBLIC_BASE_IMAGE_API + articleData.thumbnail
            : articleData.thumbnail
        }
        setImg={(file) => setArticleData({ ...articleData, thumbnail: file })}
      />
      <TextInput
        label="Article Title"
        name="title"
        value={articleData.title}
        onChange={(e) =>
          setArticleData({ ...articleData, title: e.target.value })
        }
        required
      />

      <DropdownInput
        name="categories"
        label="Select Categories"
        options={categoryOptions}
        value={articleData.categories}
        setValue={(value) =>
          setArticleData({ ...articleData, categories: value })
        }
        multiple
      />

      <TextEditor
        label="Content"
        editor={editorRef}
        content={articleData.content}
        setContent={(content) => setArticleData({ ...articleData, content })}
      />

      <div className="flex gap-5 items-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Article"
            : "Create Article"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isLoading}
          >
            Delete Article
          </Button>
        )}
      </div>

      <ConfirmModal
        title="Are you sure you want to delete this article?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </form>
  );
};

export default ManageArticle;
