"use client";

import { useEffect, useState } from "react";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import { CgClose } from "react-icons/cg";
import Button from "@/components/input/Button";
const TypesTab = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrimeTypes = async () => {
      setLoading(true);
      try {
        const response = await FetchApi({ url: "/crime/types" });
        if (response?.data?.success) {
          setTypes(response.data.data.map((item) => item.type));
        }
      } catch (err) {
        setError("Failed to fetch crime types");
      }
      setLoading(false);
    };

    fetchCrimeTypes();
  }, []);

  const handleAddType = () => {
    if (newType.trim() && !types.includes(newType.trim())) {
      setTypes([...types, newType.trim()]);
      setNewType("");
    }
  };
  const handleRemoveType = (typeToRemove) => {
    setTypes(types.filter((type) => type !== typeToRemove));
  };

  const handleSaveTypes = async () => {
    setLoading(true);
    setError(null);

    await FetchApi({
      url: "/crime/types/set",
      method: "post",
      data: types,
      isToast: true,
    });

    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="mt-2 flex gap-2 ">
          <div className="max-w-[400px] w-full">
            <TextInput
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Enter new crime type"
            />
          </div>
          <Button onClick={handleAddType}>Add</Button>
        </div>
      </div>
      {types.length === 0 ? (
        <p className="text-gray-500">No crime types defined</p>
      ) : (
        types.map((type, index) => (
          <div key={index} className="flex gap-1 items-center my-1">
            <div className={"max-w-[400px] w-full"}>
              <TextInput value={type} readOnly></TextInput>
            </div>
            <button
              onClick={() => handleRemoveType(type)}
              className="text-red-500 text-xl px-5"
              disabled={loading}
            >
              <CgClose />
            </button>
          </div>
        ))
      )}
      <Button onClick={handleSaveTypes} className={"mt-3"}>
        Save
      </Button>
    </div>
  );
};

export default TypesTab;
