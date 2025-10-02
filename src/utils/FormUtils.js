export const FormUtils = {
    createVendorFormData(formInputs) {
        const formData = new FormData();

        // User information
        formData.append('Username', formInputs.vendorName);
        formData.append('Email', formInputs.vendorEmail || '');
        formData.append('PhoneNumber', formInputs.vendorPhone);
        formData.append('Password', formInputs.password || 'Temp123!');
        formData.append('ConfirmPassword', formInputs.confirmPassword || 'Temp123!');
        formData.append('Image', formInputs.image);
        // Facility information
        formData.append('Faclity.Name', formInputs.storeName);
        formData.append('Faclity.CommercialRegister', formInputs.commercialNumber || '');
        formData.append('Faclity.Country', "Jordan");
        formData.append('Faclity.City', formInputs.city || '');
        formData.append('Faclity.Phone', formInputs.phone);
        formData.append('Faclity.Address', formInputs.address || '');
        formData.append('Faclity.Email', formInputs.email || '');
        formData.append('Faclity.Website', formInputs.website || '');

        if (formInputs.logo) {
            formData.append('Faclity.Logo', formInputs.logo);
        }

        if (formInputs.license) {
            formData.append('Faclity.CommercialRegisterImage', formInputs.license);
        }


        if (formInputs.activity) {
            formInputs.activity.forEach(activity => {
                formData.append('Faclity.Activities', activity);
            });
        }
        // Handle keywords
        if (formInputs.keywords) {
            formInputs.keywords.forEach(keyword => {
                formData.append('Faclity.Keywords', keyword);
            });
        }

        return formData;

    },

    createVendorProfileFormData(formInputs) {
        const formData = new FormData();

        // User information
        formData.append('Vendor.Username', formInputs.vendorName);
        formData.append('Vendor.Email', formInputs.vendorEmail || '');
        formData.append('Vendor.PhoneNumber', formInputs.vendorPhone);

        // Only append image if it's a new file
        if (formInputs.image && formInputs.image instanceof File) {
            formData.append('Vendor.Imagefile', formInputs.image);
        }

        // Facility information
        formData.append('Facility.Name', formInputs.storeName);
        formData.append('Facility.CommercialRegister', formInputs.commercialNumber || '');
        formData.append('Facility.Country', "Jordan");
        formData.append('Facility.City', formInputs.city || '');
        formData.append('Facility.Phone', formInputs.phone);
        formData.append('Facility.Address', formInputs.address || '');
        formData.append('Facility.Email', formInputs.email || '');
        formData.append('Facility.Website', formInputs.website || '');

        // Handle file uploads only if they are new files
        if (formInputs.logo && formInputs.logo instanceof File) {
            formData.append('Facility.Logofile', formInputs.logo);
        }

        if (formInputs.license && formInputs.license instanceof File) {
            formData.append('Facility.CommercialRegisterImagefile', formInputs.license);
        }

        // Handle activities
        if (formInputs.activity) {
            formInputs.activity.forEach(activity => {
                formData.append('Facility.Activities', activity);
            });
        }

        // Handle keywords
        if (formInputs.keywords) {
            formInputs.keywords.forEach(keyword => {
                formData.append('Facility.Keywords', keyword);
            });
        }

        return formData;
    },

    createAdminProfileData(formInputs) {
        return {
            Username: formInputs.adminName,
            Email: formInputs.email,
            PhoneNumber: formInputs.phone
        };
        // Handle file uploads

    },

    createAdminFormData(formInputs) {
        const formData = new FormData();

        formData.append('Username', formInputs.adminName);
        formData.append('Email', formInputs.email);
        formData.append('PhoneNumber', formInputs.phone);
        formData.append('Password', formInputs.password);
        formData.append('ConfirmPassword', formInputs.confirmPassword);

        // Admin-specific data
        formData.append('Faclity.Name', 'Admin Facility');
        formData.append('Faclity.CommercialRegister', formInputs.commercialRegister);
        formData.append('Faclity.Country', 'Jordan');
        formData.append('Faclity.City', formInputs.city);
        formData.append('Faclity.Phone', formInputs.phone);
        formData.append('Faclity.Email', formInputs.email);

        return formData;
    }
};
export default FormUtils;