import toast from "react-hot-toast";

export function confirmToast(message) {
    return new Promise((resolve) => {
        toast.custom((t) => (
            <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3 w-72">
                <p className="text-gray-800">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ));
    });
}
export default confirmToast;