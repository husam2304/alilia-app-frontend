// src/components/Ui/TagInput.jsx
import { useState } from "react";
import { X, Plus, Upload, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { useLanguage } from "../../contexts/LanguageContext";

const TagInput = ({ label, placeholder, value = [], onChange, error, allowExcelUpload = true }) => {
    const [inputValue, setInputValue] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const { t } = useLanguage();
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

    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv' // .csv
        ];

        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
            toast.error('يرجى اختيار ملف Excel أو CSV صالح');
            event.target.value = '';
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
            event.target.value = '';
            return;
        }

        setIsUploading(true);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract all non-empty values from all cells
            const extractedValues = [];
            jsonData.forEach(row => {
                row.forEach(cell => {
                    if (cell && typeof cell === 'string' && cell.trim()) {
                        const trimmedValue = cell.trim();
                        if (!extractedValues.includes(trimmedValue) && !value.includes(trimmedValue)) {
                            extractedValues.push(trimmedValue);
                        }
                    }
                });
            });

            if (extractedValues.length === 0) {
                toast.error('لم يتم العثور على بيانات صالحة في الملف');
                return;
            }

            // Add extracted values to existing ones
            const newValues = [...value, ...extractedValues];
            onChange(newValues);

            toast.success(`تم إضافة ${extractedValues.length} عنصر بنجاح`);
        } catch (error) {
            console.error('Error reading Excel file:', error);
            toast.error('خطأ في قراءة الملف. يرجى التأكد من صحة الملف');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex gap-2 mb-3">
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

                {allowExcelUpload && (
                    <>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleExcelUpload}
                            className="hidden"
                            id={`excel-upload-${label}`}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor={`excel-upload-${label}`}
                            className={`px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isUploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Upload size={16} />
                            )}
                        </label>
                    </>
                )}
            </div>

            {allowExcelUpload && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 text-sm mb-2">
                        <FileSpreadsheet size={16} />
                        <span className="font-medium">
                            {t('excelLabel')}
                        </span>
                    </div>
                    <p className="text-blue-600 text-xs">
                        {t('excelDetails')}

                    </p>
                </div>
            )}

            {/* Render tags */}
            <div className="flex flex-wrap gap-2 mt-3">
                {value.map((tag, idx) => (
                    <span
                        key={idx}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
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