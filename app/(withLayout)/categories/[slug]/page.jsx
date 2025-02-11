"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/Button";
import ConfirmModal from "@/components/modal/ConfirmModal";

const CategoryPage = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { slug } = useParams();
  const [id, setId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (slug !== "add") {
      setId(slug);
    } else {
      setId(null);
    }
  }, [slug]);

  useEffect(() => {
    if (id === "add") {
      setId(null);
    }
    if (id) {
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/category/${id}` });
          setCategoryData({
            name: data.data.name,
          });
        } catch (error) {
          console.error("Failed to fetch category:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = id ? `/category/update/${id}` : "/category/create";
    const method = id ? "put" : "post";

    setIsLoading(true);

    try {
      await FetchApi({
        method,
        url: apiUrl,
        data: categoryData,
        isToast: true,
        callback: () => router.push("/categories")
      });
      
    } catch (error) {
      console.error("Failed to submit category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "delete",
        url: `/category/delete/${id}`,
        isToast: true,
        callback: () => router.push("/categories")
      });
      
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="w-full">
        <TextInput
          label="Category Name"
          name="name"
          value={categoryData.name}
          onChange={(e) =>
            setCategoryData({ ...categoryData, name: e.target.value })
          }
          required
        />
      </div>
      <div className="mt-4 flex gap-4 items-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : id ? "Update Category" : "Add Category"}
        </Button>
        {id && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isLoading}
          >
            Delete Category
          </Button>
        )}
      </div>
      <ConfirmModal
        title="Are you sure you want to delete this category?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </form>
  );
};

export default CategoryPage;
