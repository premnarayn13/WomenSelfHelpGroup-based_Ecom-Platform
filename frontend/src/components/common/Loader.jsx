const Loader = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-6 h-6 border-2',
        medium: 'w-12 h-12 border-3',
        large: 'w-16 h-16 border-4',
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`spinner ${sizeClasses[size]}`}></div>
        </div>
    );
};

export default Loader;
