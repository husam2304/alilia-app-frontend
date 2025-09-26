import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import Button from './Ui/Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    hideCloseButton = false,
    className = ''
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl',
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`
                  w-full ${sizes[size]} transform overflow-hidden rounded-lg bg-white
                  text-right align-middle shadow-xl transition-all ${className}
                `}
                            >
                                {/* Header */}
                                {(title || !hideCloseButton) && (
                                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                        {title && (
                                            <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {!hideCloseButton && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;