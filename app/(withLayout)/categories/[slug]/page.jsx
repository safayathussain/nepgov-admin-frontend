"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; 
import { FetchApi } from "@/utils/FetchApi";  
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/Button";

const CategoryPage = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const {slug} = useParams()
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
    if(id === "add"){
      setId(null)
    }
    if (id) {
      const fetchCategory = async () => {
        setIsLoading(true);
        const { data } = await FetchApi({ url: `/category/${id}` });
        setCategoryData({
          name: data.data.name,
        });
        setIsLoading(false);
      };

      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = id ? `/category/update/${id}` : "/category/create";
    const method = id ? "put" : "post";

    setIsLoading(true);

    const response = await FetchApi({
      method,
      url: apiUrl,
      data: categoryData,
      isToast: true,
    });

    setIsLoading(false);
    router.push("/categories");
  };

  return (
    <form onSubmit={handleSubmit} className="  flex flex-col w-full">
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
      <div className="mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : id ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryPage;
