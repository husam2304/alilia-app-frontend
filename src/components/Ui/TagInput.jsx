// src/components/Ui/TagInput.jsx
import { useState } from "react";
import { X, Plus } from "lucide-react";

const TagInput = ({ label, placeholder, value = [], onChange, error }) => {
    const [inputValue, setInputValue] = useState("");

    const addTag = () => {
        const newValue = inputValue.trim();
        if (newValue && !value.includes(newValue)) {
            onChange([...value, newValue]);
            setInputValue("");
        }
    };

    const removeTag = (tag) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Render tags */}
            <div className="flex flex-wrap gap-2 mt-3">
                {value.map((tag, idx) => (
                    <span
                        key={idx}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        onClick={() => removeTag(tag)}
                    >
                        {tag}
                        <button type="button" >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default TagInput;
