"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/Button";
import ConfirmModal from "@/components/modal/ConfirmModal";
import TextArea from "@/components/input/TextArea";
import { formatDate } from "@/utils/functions";

const CrimeReportPage = () => {
  const [crimeData, setCrimeData] = useState({
    crimeType: "",
    location: "",
    additionalLocationDetails: "",
    time: "",
    crimeDetails: "",
    personDetails: "",
    personAppearance: "",
    personContact: "",
    hasVehicle: "",
    hasWeapon: "",
    keepInContact: false,
    isSeenByAdmin: false,
    user: {},
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
    if (id) {
      const fetchCrimeReport = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/crime/${id}` });
          setCrimeData(data.data);
        } catch (error) {
          console.error("Failed to fetch crime report:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCrimeReport();
    }
  }, [id]);

  const handleMarkAsSeen = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "patch",
        url: `/crime/seen/${id}`,
        isToast: true,
        callback: () => router.push("/crimes"),
      });
      setCrimeData({ ...crimeData, isSeenByAdmin: true });
    } catch (error) {
      console.error("Failed to mark crime as seen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await FetchApi({
        method: "delete",
        url: `/crime/delete/${id}`,
        isToast: true,
        callback: () => router.push("/crimes"),
      });
    } catch (error) {
      console.error("Failed to delete crime report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-2xl font-semibold mt-5 ">Crime Details</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="Crime Type"
          name="crimeType"
          value={crimeData.crimeType || ""}
          readOnly
        />
        <TextInput
          label="Time"
          name="time"
          value={crimeData.time ? formatDate(crimeData?.time) : "Not provided"}
          readOnly
        />
        <div className="hidden lg:block"></div>
        <TextArea
          label="Location"
          name="location"
          value={crimeData.location || ""}
          readOnly
        />
        <TextArea
          label="Additional Location Details"
          name="additionalLocationDetails"
          value={crimeData.additionalLocationDetails || ""}
          readOnly
        />
        <TextArea
          label="Crime Details"
          name="crimeDetails"
          value={crimeData.crimeDetails || ""}
          readOnly
        />
      </div>
      <p className="text-2xl font-semibold mt-5">Person/People Details</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextArea
          label="Person Details"
          name="personDetails"
          value={crimeData.personDetails || ""}
          readOnly
        />
        <TextArea
          label="Person Appearance"
          name="personAppearance"
          value={crimeData.personAppearance || ""}
          readOnly
        />
        <TextArea
          label="Person Contact"
          name="personContact"
          value={crimeData.personContact || ""}
          readOnly
        />
        <TextInput
          label="Has Vehicle"
          name="hasVehicle"
          value={
            crimeData.hasVehicle === "dontKnow"
              ? "don't know"
              : crimeData.hasVehicle
          }
          readOnly
        />
        <TextInput
          label="Has Weapon"
          name="hasWeapon"
          value={
            crimeData.hasWeapon === "dontKnow"
              ? "don't know"
              : crimeData.hasWeapon
          }
          readOnly
        />
      </div>
      <p className="text-2xl font-semibold mt-5">Reporter Details</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        <TextInput
          label="Keep In Contact"
          name="keepInContact"
          value={crimeData.keepInContact ? "Yes" : "No"}
          readOnly
        />
        <TextInput
          label="Name"
          name="user"
          value={
            crimeData?.user?.firstName && crimeData?.user?.lastName
              ? crimeData?.user?.firstName + " " + crimeData?.user?.lastName
              : ""
          }
          readOnly
        />
        <TextInput
          label="Email"
          name="email"
          value={crimeData?.user?.email || ""}
          readOnly
        />
        <TextInput
          label="Country"
          name="country"
          value={crimeData?.user?.country || ""}
          readOnly
        />
        <TextInput
          label="State/Province"
          name="state_province"
          value={crimeData?.user?.state_province || ""}
          readOnly
        />
        <TextInput
          label="City"
          name="city"
          value={crimeData?.user?.city || ""}
          readOnly
        />
         <TextInput
          label="Post Code"
          name="postCode"
          value={crimeData?.user?.postCode || ""}
          readOnly
        />
        <TextInput
          label="Street"
          name="street"
          value={crimeData?.user?.street || ""}
          readOnly
        />
        <TextInput
          label="Date Of Birth"
          name="dob"
          value={crimeData?.user?.dob || ""}
          readOnly
        />
        <TextInput
          label="Gender"
          name="gender"
          value={crimeData?.user?.gender || ""}
          readOnly
        />
        <TextInput
          label="Verified"
          name="isVerified"
          value={crimeData?.user?.isVerified ? "Yes" : "No"}
          readOnly
        />
      </div>
      <div className="mt-4 flex gap-4 items-center">
        {!crimeData.isSeenByAdmin && (
          <Button type="button" onClick={handleMarkAsSeen} disabled={isLoading}>
            Mark as Seen
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isLoading}
        >
          Delete Crime Report
        </Button>
      </div>
      <ConfirmModal
        title="Are you sure you want to delete this crime report?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        nextFunc={handleDelete}
      />
    </div>
  );
};

export default CrimeReportPage;
