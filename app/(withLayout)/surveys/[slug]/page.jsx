"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import TextInput from "@/components/input/TextInput";
import DropdownInput from "@/components/input/DropdownInput";
import Button from "@/components/input/Button";
import DateTimePicker from "@/components/input/DateTimePicker";
import FileInput from "@/components/input/FileInput";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { MdAdd, MdOutlineDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

const SurveyForm = () => {
  const [surveyData, setSurveyData] = useState({
    topic: "",
    questions: [],
    updatedQuestions: [],
    deletedQuestions: [],
    categories: null,
    liveEndedAt: "",
    thumbnail: "",
  });
  const [activeTab, setActiveTab] = useState("basics");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const isEditing = slug !== "add";

  // Memoized fetch function to prevent recreating it on each render
  const fetchCategories = useCallback(async () => {
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
  }, []);

  // Memoized fetch survey data function
  const fetchSurveyData = useCallback(async () => {
    if (!isEditing) return;

    setIsLoading(true);
    try {
      const { data } = await FetchApi({ url: `/survey/${slug}` });
      if (data?.data) {
        setSurveyData({
          topic: data.data.topic,
          questions:
            data.data.questions.map((item) => ({
              ...item,
              updatedOptions: [],
              deletedOptions: [],
            })) || [],
          updatedQuestions: [],
          deletedQuestions: [],
          categories: data.data.categories?.[0] || null,
          liveEndedAt: data.data.liveEndedAt || "",
          thumbnail: data.data.thumbnail || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch survey:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, isEditing]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch survey data if editing
  useEffect(() => {
    fetchSurveyData();
  }, [fetchSurveyData]);

  // Track a question in updatedQuestions - 
  const trackQuestionUpdate = useCallback(
    (questionIndex) => {
      const question = surveyData.questions[questionIndex];
      console.log(question);
      // Only track questions with an ID (existing questions)
      if (!question?._id) return;

      setSurveyData((prev) => {
        // Check if this question is already in updatedQuestions
        const existingIndex = prev.updatedQuestions.findIndex(
          (q) => q._id === question._id
        );

        if (existingIndex >= 0) {
          // Question already exists in updatedQuestions, update it
          const updatedQuestions = [...prev.updatedQuestions];
          updatedQuestions[existingIndex] = {
            ...updatedQuestions[existingIndex],
            question: question.question,
            updatedOptions: question.updatedOptions || [],
            deletedOptions: question.deletedOptions || [],
          };

          return {
            ...prev,
            updatedQuestions,
          };
        } else {
          // Add this question to updatedQuestions
          return {
            ...prev,
            updatedQuestions: [
              ...prev.updatedQuestions,
              {
                _id: question._id,
                question: question.question,
                updatedOptions: question.updatedOptions || [],
                deletedOptions: question.deletedOptions || [],
              },
            ],
          };
        }
      });
    },
    [surveyData.questions]
  );

  // Handle option changes - 
  const handleOptionChange = useCallback(
    (questionIndex, optionIndex, field, value) => {
      setSurveyData((prev) => {
        const newQuestions = [...prev.questions];
        const question = newQuestions[questionIndex];

        if (!question || !question.options) return prev;

        // Create a copy of the option with the updated field
        const updatedOption = {
          ...question.options[optionIndex],
          [field]: value,
        };

        // Update the option in the question's options array
        question.options[optionIndex] = updatedOption;

        // Track this option in the question's updatedOptions array
        if (updatedOption._id) {
          question.updatedOptions = [
            ...question.updatedOptions.filter(
              (opt) => opt._id !== updatedOption._id
            ),
            updatedOption,
          ];
        } else {
          question.updatedOptions = question.updatedOptions.map((item) =>
            item.updateId === updatedOption.updateId
              ? { ...item, ...updatedOption }
              : item
          );
        }

        return {
          ...prev,
          questions: newQuestions,
        };
      });

      // Track this question in updatedQuestions
      trackQuestionUpdate(questionIndex);
    },
    [trackQuestionUpdate]
  );
// Handle Question change
  const handleQuestionChange = useCallback((index, value) => {
    setSurveyData((prev) => {
      const newQuestions = [...prev.questions];
      if (!newQuestions[index]) return prev;

      newQuestions[index] = {
        ...newQuestions[index],
        question: value,
      };

      return {
        ...prev,
        questions: newQuestions,
        updatedQuestions: prev.updatedQuestions.some(
          (q) => q._id === newQuestions[index]._id
        )
          ? prev.updatedQuestions.map((q) =>
              q._id === newQuestions[index]._id ? { ...q, question: value } : q
            )
          : [
              ...prev.updatedQuestions,
              { _id: newQuestions[index]._id, question: value },
            ],
      };
    });
  }, []);

  // Add a new option to a question - 
  const addOption = useCallback(
    (questionIndex) => {
      setSurveyData((prev) => {
        const newQuestions = [...prev.questions];
        const question = newQuestions[questionIndex];

        if (!question) return prev;

        const newOption = { content: "", color: "#000000", updateId: uuidv4() };

        // Add the new option to the question's options array
        newQuestions[questionIndex] = {
          ...question,
          options: [...(question.options || []), newOption],
        };

        // Add the new option to updatedOptions if this is an existing question
        if (question._id) {
          newQuestions[questionIndex].updatedOptions = [
            ...(newQuestions[questionIndex].updatedOptions || []),
            newOption,
          ];
        }

        return { ...prev, questions: newQuestions };
      });

      // Track this question in updatedQuestions if it has an ID
      if (surveyData.questions[questionIndex]?._id) {
        trackQuestionUpdate(questionIndex);
      }
    },
    [surveyData.questions, trackQuestionUpdate]
  );

  // Remove an option from a question -  
  const removeOption = useCallback((questionIndex, optionIndex) => {
    setSurveyData((prev) => {
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];

      if (!question || !question.options) return prev;

      const removedOption = question.options[optionIndex];
      if (!removedOption) return prev;

      // Remove the option from the options array
      newQuestions[questionIndex] = {
        ...question,
        options: question.options.filter((_, i) => i !== optionIndex),
      };

      // Check if this option has an ID (is an existing option)
      if (removedOption._id) {
        // Add to deletedOptions if this option has an ID
        newQuestions[questionIndex].deletedOptions = [
          ...(newQuestions[questionIndex].deletedOptions || []),
          removedOption._id,
        ];

        // Update updatedQuestions array
        const newUpdatedQuestions = [...prev.updatedQuestions];
        const updatedQuestionIndex = newUpdatedQuestions.findIndex(
          (q) => q._id === question._id
        );

        if (updatedQuestionIndex >= 0) {
          // Question already exists in updatedQuestions, update its deletedOptions
          newUpdatedQuestions[updatedQuestionIndex] = {
            ...newUpdatedQuestions[updatedQuestionIndex],
            deletedOptions: [
              ...(newUpdatedQuestions[updatedQuestionIndex].deletedOptions ||
                []),
              removedOption._id,
            ],
          };

          return {
            ...prev,
            questions: newQuestions,
            updatedQuestions: newUpdatedQuestions,
          };
        } else {
          // Question doesn't exist in updatedQuestions, add it
          return {
            ...prev,
            questions: newQuestions,
            updatedQuestions: [
              ...prev.updatedQuestions,
              {
                _id: question._id,
                question: question.question,
                updatedOptions: question.updatedOptions || [],
                deletedOptions: [removedOption._id],
              },
            ],
          };
        }
      }

      // If option doesn't have an ID, just update questions
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Remove a question - 
  const removeQuestion = useCallback(
    (index) => {
      setSurveyData((prev) => {
        const questionToRemove = prev.questions[index];
        if (!questionToRemove) return prev;

        const newDeletedQuestions = [...prev.deletedQuestions];

        // Add to deletedQuestions if this question has an ID
        if (questionToRemove._id) {
          newDeletedQuestions.push(questionToRemove._id);
        }

        // Remove from updatedQuestions if it exists there
        const newUpdatedQuestions = prev.updatedQuestions.filter(
          (q) => q._id !== questionToRemove._id
        );

        return {
          ...prev,
          questions: prev.questions.filter((_, i) => i !== index),
          updatedQuestions: newUpdatedQuestions,
          deletedQuestions: newDeletedQuestions,
        };
      });

      // Switch to the previous tab if the active tab is deleted
      if (activeTab === `question-${index}`) {
        setActiveTab(index === 0 ? "basics" : `question-${index - 1}`);
      }
    },
    [activeTab]
  );

  // Add a new question - 
  const addQuestion = useCallback(() => {
    setSurveyData((prev) => {
      const newQuestion = {
        question: `Question ${prev.questions.length + 1}`,
        options: [],
        updatedOptions: [],
        deletedOptions: [],
      };

      return {
        ...prev,
        questions: [...prev.questions, newQuestion],
      };
    });
    setActiveTab(`question-${surveyData.questions.length}`);
  }, [surveyData.questions.length]);

  // Handle form submission - 
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("topic", surveyData.topic);
      formData.append("categories[0]", surveyData.categories?._id || "");
      formData.append("liveEndedAt", surveyData.liveEndedAt);
      if (surveyData.thumbnail instanceof File) {
        formData.append("thumbnail", surveyData.thumbnail);
      }

      // Add newly created questions
      const newQuestions = surveyData.questions.filter((q) => !q._id);
      newQuestions.forEach((q, qIndex) => {
        formData.append(`questions[${qIndex}][question]`, q.question);
        q.options.forEach((opt, oIndex) => {
          formData.append(
            `questions[${qIndex}][options][${oIndex}][content]`,
            opt.content
          );
          formData.append(
            `questions[${qIndex}][options][${oIndex}][color]`,
            opt.color
          );
        });
      });

      // Process updated questions to match the backend expectations
      surveyData.updatedQuestions.forEach((q, qIndex) => {
        formData.append(`updatedQuestions[${qIndex}][_id]`, q._id);
        formData.append(`updatedQuestions[${qIndex}][question]`, q.question);

        // Convert updatedOptions array to JSON string
        formData.append(
          `updatedQuestions[${qIndex}][updatedOptions]`,
          JSON.stringify(q.updatedOptions || [])
        );

        // Convert deletedOptions array to JSON string
        formData.append(
          `updatedQuestions[${qIndex}][deletedOptions]`,
          JSON.stringify(q.deletedOptions || [])
        );
      });

      // Add deleted questions
      formData.append(
        "deletedQuestions",
        JSON.stringify(surveyData.deletedQuestions)
      );

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
    },
    [surveyData, isEditing, slug, router]
  );

  // Handle survey deletion - 
  const handleDeleteSurvey = useCallback(async () => {
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
  }, [slug, router]);

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
          </Button>
        ))}
        <Button type="button" onClick={addQuestion} variant="primary-outline">
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
            setImg={(file) =>
              setSurveyData((prev) => ({ ...prev, thumbnail: file }))
            }
          />
          <TextInput
            label="Topic"
            value={surveyData.topic}
            onChange={(e) =>
              setSurveyData((prev) => ({ ...prev, topic: e.target.value }))
            }
            required
          />

          <div className="grid grid-cols-2 gap-5">
            <DropdownInput
              label="Select Category"
              options={categoryOptions}
              value={surveyData.categories?._id || ""}
              setValue={(value) =>
                setSurveyData((prev) => ({
                  ...prev,
                  categories:
                    categoryOptions.find((it) => it.value === value) || null,
                }))
              }
            />
            <DateTimePicker
              label="Live End Date"
              value={surveyData.liveEndedAt}
              onChange={(value) =>
                setSurveyData((prev) => ({ ...prev, liveEndedAt: value }))
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
        onConfirm={handleDeleteSurvey}
      />
    </form>
  );
};

export default SurveyForm;