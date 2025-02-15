"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import DropdownInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import DateTimePicker from "@/components/input/DateTimePicker";
import FileInput from "@/components/input/FileInput"; // Import the FileInput component
import ConfirmModal from "@/components/modal/ConfirmModal";
import { MdAdd, MdOutlineDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const SurveyForm = () => {
  const [surveyData, setSurveyData] = useState({
    topic: "",
    questions: [],
    categories: null,
    liveEndedAt: "",
    thumbnail: "", // Add thumbnail field
  });
  const [activeTab, setActiveTab] = useState("basics");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { slug } = useParams();
  const router = useRouter();
  const isEditing = slug !== "add";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await FetchApi({ url: "/category" });
        if (data?.success && Array.isArray(data.data)) {
          setCategoryOptions(
            data.data.map((category) => ({
              name: category.name,
              value: category._id,
              _id: category._id,
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

  useEffect(() => {
    if (isEditing) {
      const fetchSurveyData = async () => {
        setIsLoading(true);
        try {
          const { data } = await FetchApi({ url: `/survey/${slug}` });
          if (data?.data) {
            setSurveyData({
              topic: data.data.topic,
              questions: data.data.questions.map((q) => ({
                ...q,
                updatedOptions: [],
                deletedOptions: [],
              })),
              categories: data.data.categories?.[0] || null,
              liveEndedAt: data.data.liveEndedAt || "",
              thumbnail: data.data.thumbnail || "", // Set thumbnail if it exists
            });
          }
        } catch (error) {
          console.error("Failed to fetch survey:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSurveyData();
    }
  }, [slug, isEditing]);

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setSurveyData((prev) => {
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];

      const updatedOption = {
        ...question.options[optionIndex],
        [field]: value,
      };

      question.options[optionIndex] = updatedOption;

      question.updatedOptions = [
        ...question.updatedOptions.filter((opt, index) =>
          opt._id ? opt._id !== updatedOption._id : index !== optionIndex
        ),
        updatedOption,
      ];

      return { ...prev, questions: newQuestions };
    });
  };

  const handleQuestionChange = (index, value) => {
    setSurveyData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        question: value,
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const addOption = (questionIndex) => {
    setSurveyData((prev) => {
      const newQuestions = prev.questions.map((question, index) => {
        if (index === questionIndex) {
          const newOption = { content: "", color: "#000000" };
          return {
            ...question,
            options: [...question.options, newOption],
            updatedOptions: question.updatedOptions.concat(newOption),
          };
        }
        return question;
      });

      return { ...prev, questions: newQuestions };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setSurveyData((prev) => {
      const newQuestions = prev.questions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          const removedOption = question.options[optionIndex];
          const newOptions = question.options.filter(
            (_, i) => i !== optionIndex
          );
          const newDeletedOptions = removedOption._id
            ? [...question.deletedOptions, removedOption._id]
            : question.deletedOptions;

          return {
            ...question,
            options: newOptions,
            deletedOptions: newDeletedOptions,
          };
        }
        return question;
      });

      return { ...prev, questions: newQuestions };
    });
  };

  const removeQuestion = (index) => {
    setSurveyData((prev) => {
      const questionToRemove = prev.questions[index];
      const deletedQuestions = [...(prev.deletedQuestions || [])];

      if (questionToRemove._id) {
        deletedQuestions.push(questionToRemove._id);
      }

      return {
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
        deletedQuestions,
      };
    });

    if (activeTab === `question-${index}`) {
      setActiveTab(index === 0 ? "basics" : `question-${index - 1}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("topic", surveyData.topic);
    formData.append("categories[0]", surveyData.categories?._id || "");
    formData.append("liveEndedAt", surveyData.liveEndedAt);
    if (surveyData.thumbnail) {
      formData.append("thumbnail", surveyData.thumbnail);
    }

    surveyData.questions.forEach((q, qIndex) => {
      formData.append(`questions[${qIndex}][question]`, q.question);
      q.options.forEach((opt, oIndex) => {
        formData.append(`questions[${qIndex}][options][${oIndex}][content]`, opt.content);
        formData.append(`questions[${qIndex}][options][${oIndex}][color]`, opt.color);
      });
    });

    const apiUrl = isEditing ? `/survey/update/${slug}` : `/survey/create`;
    const method = isEditing ? "put" : "post";

    try {
      await FetchApi({
        method,
        url: apiUrl,
        data: formData,
        isToast: true,
        callback: () => router.push("/surveys"),
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setSurveyData((prev) => {
      const newQuestions = [
        ...prev.questions,
        {
          question: `Question ${prev.questions.length + 1}`,
          options: [],
          updatedOptions: [],
          deletedOptions: [],
        },
      ];
      return { ...prev, questions: newQuestions };
    });
    setActiveTab(`question-${surveyData.questions.length}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-6">
      <div className="flex border-b flex-wrap gap-2 pb-5">
        <Button
          type="button"
          onClick={() => setActiveTab("basics")}
          variant={activeTab === "basics" ? "primary" : "primary-outline"}
        >
          Basic Info
        </Button>
        {surveyData.questions.map((_, index) => (
          <Button
            key={index}
            type="button"
            onClick={() => setActiveTab(`question-${index}`)}
            variant={
              activeTab === `question-${index}` ? "primary" : "primary-outline"
            }
            className="relative group"
          >
            Q{index + 1}
            {
              <span
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeQuestion(index);
                }}
                className="absolute -top-1 -right-1 hidden group-hover:block bg-secondary rounded-full p-0.5"
              >
                <IoClose size={15} />
              </span>
            }
          </Button>
        ))}
        <Button
          type="button"
          onClick={addQuestion}
          variant="primary-outline"
        >
          <MdAdd size={25} />
        </Button>
      </div>

      {activeTab === "basics" && (
        <div className="space-y-6">
          <FileInput
            label="Thumbnail"
            img={
              typeof surveyData.thumbnail === "string"
                ? process.env.NEXT_PUBLIC_BASE_IMAGE_API + surveyData.thumbnail
                : surveyData.thumbnail
            }
            setImg={(file) => setSurveyData({ ...surveyData, thumbnail: file })}
          />
          <TextInput
            label="Topic"
            value={surveyData.topic}
            onChange={(e) =>
              setSurveyData({ ...surveyData, topic: e.target.value })
            }
            required
          />


          <div className="grid grid-cols-2 gap-5">
            <DropdownInput
              label="Select Category"
              options={categoryOptions}
              value={surveyData.categories?._id || ""}
              setValue={(value) =>
                setSurveyData({
                  ...surveyData,
                  categories:
                    categoryOptions.find((it) => it.value === value) || null,
                })
              }
            />
            <DateTimePicker
              label="Live End Date"
              value={surveyData.liveEndedAt}
              onChange={(value) =>
                setSurveyData({ ...surveyData, liveEndedAt: value })
              }
              required
            />
          </div>
        </div>
      )}

      {surveyData.questions.map(
        (question, qIndex) =>
          activeTab === `question-${qIndex}` && (
            <div key={qIndex} className="space-y-6">
              <TextInput
                label={`Question ${qIndex + 1}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Options</h3>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2">
                    <TextInput
                      placeholder="Option text"
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "content",
                          e.target.value
                        )
                      }
                      required
                      className="flex-1 md:w-[500px]"
                    />
                    <input
                      type="color"
                      value={option.color}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "color",
                          e.target.value
                        )
                      }
                      className="h-10 w-10"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => removeOption(qIndex, oIndex)}
                    >
                      <MdOutlineDelete size={25} />
                    </Button>
                  </div>
                ))}

                <Button type="button" onClick={() => addOption(qIndex)}>
                  Add Option
                </Button>
              </div>
            </div>
          )
      )}

      <div className="flex gap-4 mt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Survey"
            : "Create Survey"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isLoading}
          >
            Delete Survey
          </Button>
        )}
      </div>

      <ConfirmModal
        title="Are you sure you want to delete this survey?"
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onConfirm={async () => {
          try {
            await FetchApi({
              method: "delete",
              url: `/survey/delete/${slug}`,
              isToast: true,
              callback: () => router.push("/surveys"),
            });
          } catch (error) {
            console.error("Failed to delete survey:", error);
          }
        }}
      />
    </form>
  );
};

export default SurveyForm;