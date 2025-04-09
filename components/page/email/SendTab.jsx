"use client";

import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import SelectInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";
import TextInput from "@/components/input/TextInput";
import toast from "react-hot-toast";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const SendTab = () => {
  const [users, setUsers] = useState([]); // Only database users
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [importedContacts, setImportedContacts] = useState([]);
  const [showImported, setShowImported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [key, setKey] = useState(0);

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
        toast.error("Failed to load users or templates");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      const headers = rows[0].map((h) => h.trim().toLowerCase());
      if (
        !headers.includes("email") ||
        !headers.includes("firstname") ||
        !headers.includes("lastname")
      ) {
        toast.error("CSV must contain email, firstName, and lastName columns");
        return;
      }

      const imported = rows
        .slice(1)
        .map((row) => {
          const emailIdx = headers.indexOf("email");
          const firstNameIdx = headers.indexOf("firstname");
          const lastNameIdx = headers.indexOf("lastname");

          return {
            _id: `imported-${Math.random().toString(36).substr(2, 9)}`,
            email: row[emailIdx]?.trim(),
            firstName: row[firstNameIdx]?.trim() || "",
            lastName: row[lastNameIdx]?.trim() || "",
          };
        })
        .filter(
          (contact) => contact.email && /\S+@\S+\.\S+/.test(contact.email)
        );

      setImportedContacts(imported);
      // Add imported emails to selection
      setSelectedEmails((prev) => [
        ...prev,
        ...imported.map((contact) => contact.email),
      ]);
      toast.success(`Imported ${imported.length} contacts`);
      setShowImported(true);
      event.target.value = null;
    };

    reader.readAsText(file);
  };
  const handleSendEmail = async () => {
    if (selectedEmails.length === 0 || !selectedTemplate) {
      toast.error("Please select at least one user and a template");
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const recipients = selectedEmails.map((email) => {
        const contact = [...users, ...importedContacts].find(
          (u) => u.email === email
        );
        return {
          email,
          firstName: contact.firstName,
          lastName: contact.lastName,
        };
      });

      const response = await FetchApi({
        method: "post",
        url: "/email-log/send",
        data: {
          templateId: selectedTemplate,
          recipients,
        },
        isToast: true,
      });

      if (response?.data?.success) {
        setSendResult(response.data);
        setSelectedEmails([]);
        setSelectedTemplate("");
        setImportedContacts([]); // Clear imported contacts after successful send
        setKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      setSendResult({ success: false, message: error.message });
    } finally {
      setSending(false);
    }
  };

  const toggleImportedContact = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
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
              templates.find((item) => item.value === selectedTemplate)
                ?.category.name || ""
            }
            readOnly
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="mt-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
            <span className="cursor-pointer bg-primary text-white px-4 py-2 rounded  ">
              Import CSV
            </span>
          </label>
          {/* <Button
            onClick={() => setShowImported(!showImported)}
            className="mt-6"
            disabled={importedContacts.length === 0}
          >
            {showImported ? "Hide" : "Show"} Imported ({importedContacts.length})
          </Button> */}
          <Button
            onClick={handleSendEmail}
            disabled={
              sending || selectedEmails.length === 0 || !selectedTemplate
            }
            className="mt-6"
          >
            {sending ? "Sending..." : "Send Bulk Emails"}
          </Button>
        </div>
      </div>

      {sendResult && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className={sendResult.success ? "text-green-600" : "text-red-600"}>
            {sendResult.message}
          </p>
        </div>
      )}

      <div className="mb-4 p-4 bg-gray-100 rounded max-h-64 overflow-y-auto">
        <div className="flex justify-between items-center  ">
          <h3 className="font-bold  text-lg">Imported Contacts</h3>
          <button
            onClick={() => setShowImported(!showImported)}
            className="  flex items-center "
            disabled={importedContacts.length === 0}
          >
            {showImported ? (
              <RiArrowDownSLine size={30} />
            ) : (
              <RiArrowUpSLine size={30} />
            )}
            ({importedContacts.length})
          </button>
        </div>
        {showImported && importedContacts.length > 0 && (
          <ul className="space-y-2 mt-4">
            {importedContacts.map((contact) => (
              <li key={contact._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(contact.email)}
                  onChange={() => toggleImportedContact(contact.email)}
                />
                <span>{contact.email}</span>
                <span>-</span>
                <span>
                  {contact.firstName} {contact.lastName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Table
        key={key}
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
        initialSelected={users.map((user) => user._id)} // Pre-select all database users
        onSelectionChange={(selectedIds) => {
          const tableEmails = users
            .filter((user) => selectedIds.includes(user._id))
            .map((user) => user.email);
          // Combine with selected imported emails
          const importedEmails = selectedEmails.filter((email) =>
            importedContacts.some((contact) => contact.email === email)
          );
          setSelectedEmails([...tableEmails, ...importedEmails]);
        }}
      />
    </div>
  );
};

export default SendTab;
