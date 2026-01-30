import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message }) => {
    return (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
