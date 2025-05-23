"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import TextArea from "@/components/input/TextArea";
import Button from "@/components/input/Button";
import ConfirmModal from "@/components/modal/ConfirmModal";

const UserDetailsPage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state_province: "",
    dob: "",
    gender: "",
    postCode: "",
    role: "",
    isVerified: false,
    profilePicture: null,
    createdAt: "",
    survey: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/user/${slug}` });
          setUserData(data.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [slug]);

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        url: `/user/delete/${slug}`,
        method: "delete",
        isToast: true,
        callback: () => router.push("/users"),
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-2xl font-semibold mt-5">Personal Information</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="First Name"
          name="firstName"
          value={userData.firstName || ""}
          readOnly
        />
        <TextInput
          label="Last Name"
          name="lastName"
          value={userData.lastName || ""}
          readOnly
        />
        <TextInput
          label="Email"
          name="email"
          value={userData.email || ""}
          readOnly
        />
      </div>

      <p className="text-2xl font-semibold mt-5">Address Details</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="Country"
          name="country"
          value={userData?.country || ""}
          readOnly
        />
        <TextInput
          label="State/Province"
          name="state_province"
          value={userData?.state_province || ""}
          readOnly
        />
        <TextInput
          label="City"
          name="city"
          value={userData.city || ""}
          readOnly
        />
        <TextInput
          label="Post Code"
          name="postCode"
          value={userData.postCode || ""}
          readOnly
        />
        <TextInput
          label="Street"
          name="street"
          value={userData.street || ""}
          readOnly
        />
      </div>

      <p className="text-2xl font-semibold mt-5">Additional Information</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="Date of Birth"
          name="dob"
          value={userData.dob || ""}
          readOnly
        />
        <TextInput
          label="Gender"
          name="gender"
          value={userData.gender || ""}
          readOnly
        />
        <TextInput
          label="Role"
          name="role"
          value={userData.role || ""}
          readOnly
        />
        <TextInput
          label="Verified"
          name="isVerified"
          value={userData.isVerified ? "Yes" : "No"}
          readOnly
        />
        <TextInput
          label="Joined Date"
          name="createdAt"
          value={new Date(userData.createdAt).toLocaleDateString() || ""}
          readOnly
        />
      </div>

      <p className="text-2xl font-semibold mt-5">Profile Survey</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="Reason For Joining"
          name="reasonForJoining"
          value={userData.survey?.reasonForJoining || ""}
          readOnly
        />
        <TextInput
          label="Political Party"
          name="politicalParty"
          value={userData.survey?.politicalParty || ""}
          readOnly
        />
        <TextInput
          label="Ethnicity"
          name="ethnicity"
          value={userData.survey?.ethnicity || ""}
          readOnly
        />
        <TextInput
          label="Highest Qualification"
          name="highestQualification"
          value={userData.survey?.highestQualification || ""}
          readOnly
        />
        <TextArea
          label="Consent Categories"
          name="consentCategories"
          value={userData.survey?.consentCategories?.join(", ") || ""}
          readOnly
        />
      </div>

      <div className="mt-5">
        <Button
          variant="secondary"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isLoading}
        >
          Delete User
        </Button>
      </div>

      <ConfirmModal
        title="Are you sure you want to delete this user?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDeleteUser}
      />
    </div>
  );
};

export default UserDetailsPage;
