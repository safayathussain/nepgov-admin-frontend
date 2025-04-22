"use client";
import React, { useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";

const FileInput = ({ img, setImg }) => {
  const [profilePicturePreview, setProfilePicturePreview] = useState(img);
  const [aspectRatio, setAspectRatio] = useState(1.7);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
      setImg(file);
      const imgElement = new Image();
      imgElement.src = previewUrl;
      imgElement.onload = () => {
        const { width, height } = imgElement;
        setAspectRatio(width / height);
      };
    }
  };

  useEffect(() => {
    if (typeof img === "string") {
      setProfilePicturePreview(img);
      const imgElement = new Image();
      imgElement.src = img;
      imgElement.onload = () => {
        const { width, height } = imgElement;
        setAspectRatio(width / height);
      };
    }
  }, [img]);
  console.log();
  return (
    <div>
      <div
        className="bg-gray-100 max-w-[500px] mx-auto rounded-lg p-4 flex flex-col items-center justify-center relative group cursor-pointer"
        style={{ aspectRatio: aspectRatio }}
      >
        <input
          type="file"
          id="img"
          name="img"
          accept="image/jpeg, image/jpg, image/png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        {profilePicturePreview !== process.env.NEXT_PUBLIC_BASE_IMAGE_API &&
        profilePicturePreview !== "" ? (
          <img
            src={profilePicturePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg max-w-[500px]"
            style={{ aspectRatio: aspectRatio }}
          />
        ) : (
          <>
            <BiImageAdd className="w-12 h-12 text-gray-400 mb-2 group-hover:text-gray-500 transition-colors" />
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors text-center">
              Upload Image
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileInput;
