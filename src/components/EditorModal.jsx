import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";

const EditorModal = ({ isOpen, onClose, applicationId, field, initialValue, onSaved }) => {

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const handleSave = async () => {
    try {
      await api.patch(
        `/applications/update-content/${applicationId}/`,
        {
          field,
          value
        }
      );

      alert("Saved successfully");
      onSaved(value);
      onClose();

    } catch (err) {
      alert("Failed to save");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

      <div className="bg-white w-[80%] h-[80%] p-4 rounded-lg flex flex-col">

        <h2 className="text-xl font-bold mb-2">
          Edit {field === "cover_letter" ? "Cover Letter" : "Tailored Resume"}
        </h2>

        <ReactQuill
          value={value}
          onChange={setValue}
          className="flex-1"
        />

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditorModal;