"use client";

import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import SelectInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";
import TextInput from "@/components/input/TextInput";

const SendTab = () => {
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [key, setKey] = useState(0); // Add key to force Table re-render

  const columns = [
    { key: "email", label: "Email" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "dob", label: "Birth" },
    { key: "gender", label: "Gender" },
    { key: "city", label: "City" },
    { key: "postCode", label: "Post Code" },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userResponse, templateResponse] = await Promise.all([
          FetchApi({ url: "/user" }),
          FetchApi({ url: "/email-template" }),
        ]);

        if (userResponse?.data?.success) {
          const formattedUsers = userResponse.data.data.map((item) => ({
            _id: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            dob: formatDate(item.dob),
            gender: item.gender,
            city: item.city,
            postCode: item.postCode,
            createdAt: formatDate(item.createdAt),
            profilePicture: item.profilePicture
              ? `/uploads/${item.profilePicture}`
              : "/default-avatar.png",
          }));
          setUsers(formattedUsers);
        }

        if (templateResponse?.data?.success) {
          setTemplates(
            templateResponse.data.data.map((template) => ({
              value: template._id,
              name: template.name,
              category: template.category,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0 || !selectedTemplate) {
      alert("Please select at least one user and a template.");
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const response = await FetchApi({
        method: "post",
        url: "/email-log/send",
        data: {
          templateId: selectedTemplate,
          recipients: selectedUsers,
        },
        isToast: true,
      });

      if (response?.data?.success) {
        setSendResult(response.data);
        setSelectedUsers([]); // Reset selected users
        setSelectedTemplate(""); // Reset selected template
        setKey((prev) => prev + 1); // Force Table re-render
      }
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      setSendResult({ success: false, message: error.message });
    } finally {
      setSending(false); // Ensure sending state is reset
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <SelectInput
          label="Select Template"
          name="template"
          value={selectedTemplate}
          setValue={setSelectedTemplate}
          options={templates}
          required
          className="min-w-64"
        />
        <div>
          <TextInput
            className="min-w-64 w-max"
            label="Category"
            value={
              templates.find((item) => item.value === selectedTemplate)?.category.name || ""
            }
            readOnly
          />
        </div>
        <Button
          onClick={handleSendEmail}
          disabled={sending || selectedUsers.length === 0 || !selectedTemplate}
          className="mt-6"
        >
          {sending ? "Sending..." : "Send Bulk Emails"}
        </Button>
      </div>

      {sendResult && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className={sendResult.success ? "text-green-600" : "text-red-600"}>
            {sendResult.message}
          </p>
        </div>
      )}

      <Table
        key={key} // Force re-render when key changes
        data={users}
        columns={columns}
        searchableColumns={[
          "firstName",
          "lastName",
          "email",
          "city",
          "dob",
          "postCode",
        ]}
        loading={loading}
        showAddButton={false}
        showCheckboxes={true}
        onSelectionChange={(selected) => setSelectedUsers(selected)} // Ensure this updates state
      />
    </div>
  );
};

export default SendTab;