type Doctor = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  seenRecently: boolean;
};

type DoctorCardProps = {
  doctor: Doctor;
  onClick: (doctor: Doctor) => void;
};

export default function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  return (
    <div
      onClick={() => onClick(doctor)}
      className="flex items-center p-4 border max-w-3xl mx-auto rounded-4xl bg-white shadow hover:bg-blue-50 transform hover:scale-105 duration-200 cursor-pointer transition overflow-hidden mb-6"
    >
      <img
        src={doctor.avatar}
        alt={doctor.name}
        className="w-35 h-40 rounded-3xl object-cover mr-10"
      />
      <div>
        <h3 className="font-semibold text-4xl text-gray-800 mb-2">{doctor.name}</h3>
        <p className="text-[#D1978A] text-lg">{doctor.title}</p>
      </div>
    </div>
  );
}
