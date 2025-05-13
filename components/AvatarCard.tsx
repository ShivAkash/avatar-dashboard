interface AvatarCardProps {
  name: string;
  image: string;
  onEdit: () => void;
}

const AvatarCard = ({ name, image, onEdit }: AvatarCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={`${name} avatar`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800">{name}</h3>
        <div className="mt-3 flex justify-end">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCard;